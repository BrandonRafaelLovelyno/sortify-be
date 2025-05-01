import { PrismaService } from "src/prisma/prisma.service";
import { SignUpDto } from "./auth.dto";
import { Injectable } from "@nestjs/common";
import { Token } from "src/common/token";

@Injectable()
export class AuthHelper {
  constructor(private readonly prismaService: PrismaService, private readonly token: Token) {}

  async checkExistingSignUpRequest(email: string) {
    return this.prismaService.signUpRequest.findFirst({
      where: { email }
    });
  }

  async createSignUpRequest(body: SignUpDto) {
    return this.prismaService.signUpRequest.create({
      data: {
        email: body.email,
        hashedPassword: body.hashedPassword,
        name: body.name,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    });
  }

  async findSignUpRequestById(id: string) {
    return this.prismaService.signUpRequest.findUnique({
      where: { id },
    });
  }

  async createUser(email: string, hashedPassword: string, name: string) {
    return this.prismaService.user.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });
  }

  async deleteSignUpRequest(id: string) {
    return this.prismaService.signUpRequest.delete({
      where: { id },
    });
  }

  findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return this.token.compareHashedToken(plainPassword, hashedPassword);
  }
}