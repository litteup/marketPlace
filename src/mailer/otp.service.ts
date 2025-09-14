import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Otp } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OtpType } from './otp.types';

// ✅ Typed interfaces for OTP service
export interface GeneratedOtp {
  selector: string;
  expiresAt: Date;
  code: string;
  debugCode?: string;
}

export interface VerifiedOtp {
  verified: boolean;
  purpose: OtpType;
  userId: string | null;
  email: string | null; // ⚡ fixed: allow null
}

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  private get otpExpiryMinutes(): number {
    return Number(process.env.OTP_EXP_MINUTES ?? 5);
  }

  private get maxAttempts(): number {
    return Number(process.env.OTP_MAX_ATTEMPTS ?? 5);
  }

  private get resendCooldownSeconds(): number {
    return Number(process.env.OTP_RESEND_COOLDOWN ?? 60);
  }

  private generateSelector(): string {
    return randomBytes(8).toString('hex');
  }

  private generateNumericCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async generateOtp(
    email: string,
    type: OtpType,
    options?: { debug?: boolean },
  ): Promise<GeneratedOtp> {
    const debug = options?.debug ?? false;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user && type !== OtpType.SIGNUP) {
      throw new NotFoundException('User not found');
    }

    const last = await this.prisma.otp.findFirst({
      where: { email, type },
      orderBy: { createdAt: 'desc' },
    });

    if (last) {
      const diff = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
      if (diff < this.resendCooldownSeconds) {
        throw new BadRequestException(
          `Please wait ${Math.ceil(this.resendCooldownSeconds - diff)}s before requesting a new OTP`,
        );
      }
    }

    await this.prisma.otp.updateMany({
      where: { email, type, used: false },
      data: { used: true, consumedAt: new Date() },
    });

    const code = this.generateNumericCode();
    const codeHash = await bcrypt.hash(
      code,
      Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
    );
    const selector = this.generateSelector();
    const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    const created = await this.prisma.otp.create({
      data: {
        selector,
        codeHash,
        ...(debug ? { code } : {}),
        type,
        email,
        userId: user?.id ?? null,
        expiresAt,
        maxAttempts: this.maxAttempts,
      },
    });

    const result: GeneratedOtp = {
      selector: created.selector,
      expiresAt: created.expiresAt,
      code,
    };
    if (debug) result.debugCode = code;

    return result;
  }

  async verifyOtp(
    email: string,
    code: string,
    type: OtpType,
    selector?: string,
  ): Promise<VerifiedOtp> {
    let otpRecord: Otp | null = null;

    if (selector) {
      otpRecord = await this.prisma.otp.findUnique({ where: { selector } });
    } else {
      otpRecord = await this.prisma.otp.findFirst({
        where: { email, type, used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!otpRecord) throw new NotFoundException('OTP not found');

    if (otpRecord.used) throw new BadRequestException('OTP already used');

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    if (
      (otpRecord.attempts ?? 0) >= (otpRecord.maxAttempts ?? this.maxAttempts)
    ) {
      throw new BadRequestException('Too many attempts. Request a new OTP.');
    }

    const matches = await bcrypt.compare(code, otpRecord.codeHash);
    if (!matches) {
      await this.prisma.otp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true, consumedAt: new Date() },
    });

    if (type === OtpType.EMAIL_VERIFICATION && otpRecord.userId) {
      await this.prisma.user.update({
        where: { id: otpRecord.userId },
        data: { verification_status: 'verified' },
      });
    }

    return {
      verified: true,
      purpose: type,
      userId: otpRecord.userId,
      email: otpRecord.email,
    };
  }
}
