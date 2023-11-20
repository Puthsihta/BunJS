import { Elysia, t } from "elysia";
import { prisma } from "../libs/prisma";
import { comparePassword, hashPassword, md5hash } from "../utils/bcrypt";

const signUp = async ({ body, set }: any) => {
  const { email, name, password, username } = body;
  // validate duplicate email address
  //   return {
  //     email,
  //     name,
  //     password,
  //     username,
  //   };
  const emailExists = await prisma.author.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  //   return { emailExists };
  if (emailExists) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Email address already in use.",
    };
  }

  // validate duplicate username
  const usernameExists = await prisma.author.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  //   return { usernameExists };

  if (usernameExists) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Someone already taken this username.",
    };
  }

  // handle password
  const { hash, salt } = await hashPassword(password);
  const emailHash = md5hash(email);
  const profileImage = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  const newUser = await prisma.author.create({
    data: {
      name,
      email,
      hash,
      salt,
      username,
      profileImage,
    },
  });

  return {
    success: true,
    message: "Account created",
    data: {
      user: newUser,
    },
  };
};

const login = async ({ body, set, jwt, setCookie }: any) => {
  const { username, password } = body;
  // verify email/username
  const user: any = await prisma.author.findFirst({
    where: {
      OR: [
        {
          email: username,
        },
        {
          username,
        },
      ],
    },
    select: {
      id: true,
      hash: true,
      salt: true,
    },
  });

  if (!user) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Invalid username",
    };
  }

  // verify password
  const match = await comparePassword(password, user.salt, user.hash);
  if (!match) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Invalid password",
    };
  }

  // generate access and refresh token

  const accessToken = await jwt.sign({
    userId: user.id,
  });
  const refreshToken = await jwt.sign({
    userId: user.id,
  });
  setCookie("access_token", accessToken, {
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });
  setCookie("refresh_token", refreshToken, {
    maxAge: 86400 * 7, // 7 days
    path: "/",
  });

  return {
    success: true,
    data: null,
    token: refreshToken,
    message: "Account login successfully",
  };
};

export { signUp, login };
