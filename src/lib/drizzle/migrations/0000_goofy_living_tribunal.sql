CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);
