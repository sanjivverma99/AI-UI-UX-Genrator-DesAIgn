CREATE TABLE "project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userInput" varchar(1000) NOT NULL,
	"projectName" varchar(255),
	"theme" varchar(1000),
	"projectId" varchar(255) NOT NULL,
	"device" varchar(100) NOT NULL,
	"createdOn" timestamp DEFAULT now(),
	"config" json,
	"projectVisualDescription" varchar(1000),
	"userId" varchar(255) NOT NULL,
	"screenshot" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "screenconfig" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "screenconfig_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" varchar,
	"screenName" varchar,
	"screenID" varchar,
	"purpose" varchar,
	"screenDescription" varchar,
	"code" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer DEFAULT 5,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_userId_users_email_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenconfig" ADD CONSTRAINT "screenconfig_projectId_project_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("projectId") ON DELETE no action ON UPDATE no action;