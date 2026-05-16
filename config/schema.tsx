import { integer, pgTable, varchar, timestamp, json, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer().default(5)
});


export const ProjectTable = pgTable("project", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar({ length: 1000 }).notNull(),
  projectName: varchar({ length: 255 }),
  theme: json("theme"),
  projectId: varchar({ length: 255 }).notNull(),
  device: varchar({ length: 100 }).notNull(),
  createdOn: timestamp().defaultNow(),
  config: json(),
  projectVisualDescription: varchar({ length: 1000 }),
  userId: varchar({ length: 255 })
    .references(() => usersTable.email)
    .notNull(),
});

export const ScreenConfigTable = pgTable("screenconfig", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar().references(() => ProjectTable.projectId),
  screenName: varchar(),
  screenID: varchar(),
  purpose: varchar(),
  screenDescription: varchar(),
  code: text(),
})