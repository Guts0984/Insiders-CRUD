import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { users, type User } from "../../db/schema.ts";
import { appError } from "../../utils/app-error.ts";

const publicUserSelection = {
  id: users.id,
  email: users.email,
  name: users.name,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export type PublicUser = Pick<
  User,
  "id" | "email" | "name" | "createdAt" | "updatedAt"
>;
export type CreateUserInput = Pick<User, "email" | "name"> & {
  password: string;
};
export type UpdateUserInput = Partial<Pick<User, "email" | "name">>;

function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  while (typeof current === "object" && current !== null) {
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
}

export async function listUsers(): Promise<PublicUser[]> {
  return db.select(publicUserSelection).from(users);
}

export async function getUserById(id: string): Promise<PublicUser> {
  const [user] = await db
    .select(publicUserSelection)
    .from(users)
    .where(eq(users.id, id));
  if (!user) {
    throw appError(404, "User not found");
  }
  return user;
}

export async function createUser(data: CreateUserInput): Promise<PublicUser> {
  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    const [created] = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        passwordHash,
      })
      .returning(publicUserSelection);
    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw appError(409, "Email already in use");
    }
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<PublicUser> {
  try {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(publicUserSelection);
    if (!updated) {
      throw appError(404, "User not found");
    }
    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw appError(409, "Email already in use");
    }
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  if (!deleted) {
    throw appError(404, "User not found");
  }
}
