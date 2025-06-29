CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'superadmin');--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"user_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "profiles_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "check_ins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"clock_in" timestamp NOT NULL,
	"clock_out" timestamp,
	"date_today" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "check_ins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tasks" (
	"taskId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"task_name" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"is_complete" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;