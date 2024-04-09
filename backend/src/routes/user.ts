import { Hono } from "hono";

import { sign } from "hono/jwt";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signipInput, signupInput } from "@nahi_ho_raha/medium-commom";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    // can add ignore over here for ts but not good so added generic binding in hono seen above
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  try {
    const existuser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existuser) {
      c.status(403);
      return c.json({ error: "User already exist" });
    }
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signipInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "User not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({ jwt });
});
