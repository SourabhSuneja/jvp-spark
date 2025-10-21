-- =========================
-- DROP TABLES (parent –> child)
-- This will also automatically drop associated triggers, policies, and constraints.
-- =========================
DROP TABLE IF EXISTS menu_resources CASCADE;
DROP TABLE IF EXISTS subject_resources CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS push_subscriptions CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS student_quota_usage CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS notification_read_logs CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS question_banks CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS hard_limits CASCADE;

-- =========================
-- DROP FUNCTIONS
-- These are not tied to a table, so they need to be dropped separately.
-- =========================
DROP FUNCTION IF EXISTS get_student_dashboard_data();
DROP FUNCTION IF EXISTS get_student_by_access_token(TEXT);
DROP FUNCTION IF EXISTS get_student_profile(UUID);
DROP FUNCTION IF EXISTS create_settings_for_student();
DROP FUNCTION IF EXISTS set_default_avatar();
DROP FUNCTION IF EXISTS log_welcome_notification();
DROP FUNCTION IF EXISTS handle_new_student_subscriptions();
DROP FUNCTION IF EXISTS get_specific_notification(p_notification_id text);
DROP FUNCTION IF EXISTS get_all_notifications(uuid, integer);
DROP FUNCTION IF EXISTS check_question_access(BIGINT);
DROP FUNCTION IF EXISTS get_question_banks_with_details(INT, TEXT);
DROP FUNCTION IF EXISTS get_custom_question_set(
    BIGINT[],
    JSONB,
    JSONB,
    BOOLEAN,
    INT
);
DROP FUNCTION IF EXISTS filter_questions(
    JSONB,
    JSONB,
    BOOLEAN
);



-- =========================
-- TABLE CREATION
-- =========================

-- Hard limits: To store hard limits on retrievals
CREATE TABLE hard_limits (
    limit_name TEXT PRIMARY KEY,
    limit_number INT NOT NULL,
    description TEXT
);

-- Subscription plans: To store details and limits of each subscription plan
CREATE TABLE subscription_plans (
    plan_name TEXT PRIMARY KEY,
    question_cap INT NOT NULL,
    description TEXT,
    quota_period TEXT CHECK (quota_period IN ('day', 'month', 'week', 'none')) NOT NULL DEFAULT 'none',
    quota_limit INT NOT NULL DEFAULT 0,
    extra JSONB
);

-- Question banks: Organize questions into groups by grade, subject, book, etc.
CREATE TABLE question_banks (
    id BIGSERIAL PRIMARY KEY,
    bank_key TEXT NOT NULL UNIQUE, -- The unique key for referencing in front-end
    display_name TEXT NOT NULL UNIQUE,
    grade INT NOT NULL,
    subject TEXT NOT NULL,
    book TEXT NOT NULL DEFAULT 'Generic',
    chapter TEXT,
    topic TEXT,
    keywords TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Questions: Store the individual questions
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    question_bank_id BIGINT NOT NULL REFERENCES question_banks(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'Fill up', 'True/False', 'Match items', 'Very Short Answer Type', 'Short Answer Type', 'Long Answer Type', 'Very Long Answer Type', 'Diagram/Picture/Map Based')),
    difficulty_level SMALLINT NOT NULL DEFAULT 1,
    details JSONB, -- Stores all other data: options, answers, explanations, etc.
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Table to store menu items for app's navigation drawer
CREATE TABLE menu_resources (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    page_key TEXT NOT NULL UNIQUE,
    link TEXT NOT NULL,
    min_width INT,
    display_order SMALLINT NOT NULL DEFAULT 0,
    extra JSONB
);

-- Table to store dashboard card information for each subject
CREATE TABLE subject_resources (
    id            BIGSERIAL PRIMARY KEY,
    subject       TEXT NOT NULL,
    grade         INT, -- NULL = applies to all grades
    title         TEXT NOT NULL,
    icon          TEXT NOT NULL,
    page_key      TEXT NOT NULL UNIQUE,
    link          TEXT,          -- The URL for the iframe, can be NULL for internal pages
    min_width     INT,
    display_order SMALLINT DEFAULT 0 NOT NULL,
    extra JSONB
);

-- Notifications table
CREATE TABLE notifications (
    -- Primary Key and Logging
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    -- Notification Details
    message_title text NOT NULL,
    message_body text NOT NULL,
    detailed_message text,

    -- Targeting Information
    target_type text NOT NULL, -- e.g., 'all', 'grade', 'grade-section', 'token'
    target_tokens jsonb,       -- The specific tokens/grades/sections used for filtering

    -- Result Metrics
    targeted_recipients integer, -- The number of subscriptions found
    success_count integer,       -- The number of devices successfully reached

    sent_by text NOT NULL,
    extra JSONB
);

-- Students table
CREATE TABLE students (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    grade        INT NOT NULL,
    section      TEXT,
    gender       TEXT NOT NULL,
    school       TEXT,
    house        TEXT,
    dob          DATE,
    father_name  TEXT,
    phone        TEXT,
    address      TEXT,
    city         TEXT,
    access_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    extra JSONB
);

-- Notification read logs
CREATE TABLE notification_read_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    read_at TIMESTAMP NOT NULL DEFAULT now(),
    extra JSONB,

    -- Prevent duplicate entries (same student reading same notification multiple times)
    UNIQUE (notification_id, student_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id                  BIGSERIAL PRIMARY KEY,
    student_id          UUID REFERENCES students(id) ON DELETE CASCADE,
    grade               INT NOT NULL,
    subject             TEXT NOT NULL,
    subscription_plan   TEXT NOT NULL DEFAULT 'Free' REFERENCES subscription_plans(plan_name) ON UPDATE CASCADE ON DELETE RESTRICT,
    subscription_ends_at TIMESTAMP NOT NULL DEFAULT '2026-03-31 23:59:59',
    extra               JSONB,

    -- Prevent duplicates: one subscription per student per grade and subject
    UNIQUE (student_id, grade, subject)
);

-- Table to log student's question retrieval usage against their quota
CREATE TABLE student_quota_usage (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    grade INT NOT NULL,
    subject TEXT NOT NULL,
    period_start_date DATE NOT NULL, -- e.g., '2025-10-19' for day, '2025-10-01' for month
    questions_retrieved INT NOT NULL DEFAULT 0,

    -- Primary key ensures one row per student/subscription/period
    -- This index also makes quota lookups extremely fast
    PRIMARY KEY (student_id, grade, subject, period_start_date)
);

-- Teachers table
CREATE TABLE teachers (
    id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name  TEXT NOT NULL,
    email TEXT NOT NULL,
    extra JSONB
);

-- Settings table
CREATE TABLE settings (
    student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    theme      SMALLINT NOT NULL DEFAULT 0 CHECK (theme IN (0, 1)), -- 0 = dark, 1 = light
    avatar     TEXT NOT NULL,
    nickname   TEXT,
    extra      JSONB
);

-- Push subscriptions table
CREATE TABLE push_subscriptions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id         UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subscription_object JSONB NOT NULL,
    endpoint           TEXT UNIQUE,
    created_at         TIMESTAMP DEFAULT now()
);


-- =========================
-- FUNCTIONS
-- =========================

-- Function: get dashboard cards specific to a student
CREATE OR REPLACE FUNCTION get_student_dashboard_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    student_id_param UUID := auth.uid();
    result           jsonb;
BEGIN
    SELECT jsonb_object_agg(subject, cards) INTO result
    FROM (
        SELECT
            s.subject,
            jsonb_agg(
                jsonb_build_object(
                    'title',     sr.title,
                    'icon',      sr.icon,
                    'page',      sr.page_key,
                    'link',      sr.link,
                    'min_width', sr.min_width,
                    'extra', sr.extra
                )
                ORDER BY sr.display_order ASC
            ) AS cards
        FROM subscriptions s
        JOIN subject_resources sr
          ON s.subject = sr.subject
        WHERE s.student_id = student_id_param
          AND (sr.grade IS NULL OR sr.grade = s.grade)
        GROUP BY s.subject
    ) AS aggregated_subjects;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Function: get student details using access tokens
CREATE OR REPLACE FUNCTION get_student_by_access_token(access_token_param TEXT)
RETURNS TABLE (name TEXT, grade INT, section TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_uuid UUID;
BEGIN
    -- Try casting the input
    BEGIN
        token_uuid := access_token_param::UUID;
    EXCEPTION WHEN invalid_text_representation THEN
        RETURN; -- invalid token string â†’ return nothing
    END;

    RETURN QUERY
    SELECT s.name, s.grade, s.section
    FROM students s
    WHERE s.access_token = token_uuid;
END;
$$;

-- Function: get student profile (details + settings)
CREATE OR REPLACE FUNCTION get_student_profile(p_student_id UUID)
RETURNS TABLE (
    name        TEXT,
    grade       INT,
    section     TEXT,
    gender      TEXT,
    school      TEXT,
    house       TEXT,
    dob         DATE,
    father_name TEXT,
    phone       TEXT,
    address     TEXT,
    city        TEXT,
    access_token UUID,
    theme       SMALLINT,
    avatar      TEXT,
    nickname    TEXT
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.name,
        s.grade,
        s.section,
        s.gender,
        s.school,
        s.house,
        s.dob,
        s.father_name,
        s.phone,
        s.address,
        s.city,
        s.access_token,
        COALESCE(st.theme, 0::SMALLINT),
        COALESCE(
            st.avatar,
            'avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light'
        ),
        st.nickname
    FROM students s
    LEFT JOIN settings st ON s.id = st.student_id
    WHERE s.id = p_student_id;
END;
$$;

-- Function to get unread notification count + 5 or a specified number of notifications
-- with conditional sorting.
CREATE OR REPLACE FUNCTION get_all_notifications(
    last_notification_id uuid DEFAULT NULL,
    page_size integer DEFAULT 5
)
RETURNS TABLE(
    count_unread bigint,
    notifications jsonb
)
LANGUAGE sql
SECURITY INVOKER
AS $$
    SELECT
        (
            SELECT COUNT(*)::bigint
            FROM notifications n
            WHERE NOT EXISTS (
                SELECT 1 FROM notification_read_logs r
                WHERE r.notification_id = n.id
                  AND r.student_id = auth.uid()
            )
        ) AS count_unread,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', n2.id,
                        'sent_by', n2.sent_by,
                        'created_at', n2.created_at,
                        'message_title', n2.message_title,
                        'message_body', n2.message_body,
                        'is_read', n2.is_read
                    )
                    ORDER BY n2.created_at DESC
                )
                FROM (
                    SELECT 
                        n2.*,
                        CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM notification_read_logs r2
                                WHERE r2.notification_id = n2.id
                                  AND r2.student_id = auth.uid()
                            ) THEN 1 ELSE 0
                        END AS is_read
                    FROM notifications n2
                    WHERE (
                        last_notification_id IS NULL
                        OR n2.created_at < (
                            SELECT created_at FROM notifications WHERE id = last_notification_id
                        )
                    )
                    ORDER BY n2.created_at DESC
                    LIMIT page_size
                ) n2
            ),
            '[]'::jsonb
        ) AS notifications;
$$;

-- This function checks if the current user can access a given question_id (to be used in RLS policies)
CREATE OR REPLACE FUNCTION check_question_access(question_id_to_check BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    v_student_id UUID := auth.uid();
    v_question_cap INT;
    v_question_rank BIGINT;
    v_question_grade INT;
    v_question_subject TEXT;
BEGIN
    -- Step 1: Get the grade and subject for the question being checked.
    SELECT qb.grade, qb.subject
    INTO v_question_grade, v_question_subject
    FROM questions q
    JOIN question_banks qb ON q.question_bank_id = qb.id
    WHERE q.id = question_id_to_check;

    -- If the question doesn't exist, deny access.
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Step 2: Get the student's question cap from their active subscription.
    SELECT sp.question_cap
    INTO v_question_cap
    FROM subscriptions s
    JOIN subscription_plans sp ON s.subscription_plan = sp.plan_name
    WHERE s.student_id = v_student_id
      AND s.grade = v_question_grade
      AND s.subject = v_question_subject
      AND s.subscription_ends_at > now(); -- Ensure the subscription is active

    -- If no active subscription is found for this subject/grade, deny access.
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Step 3: Calculate the "rank" of the question (e.g., is it the 5th or 105th question).
    -- We rank questions by their ID, partitioned by grade and subject.
    WITH ranked_questions AS (
        SELECT
            q.id,
            ROW_NUMBER() OVER (PARTITION BY qb.grade, qb.subject ORDER BY q.id ASC) as rn
        FROM questions q
        JOIN question_banks qb ON q.question_bank_id = qb.id
        WHERE qb.grade = v_question_grade AND qb.subject = v_question_subject
    )
    SELECT rn INTO v_question_rank FROM ranked_questions WHERE id = question_id_to_check;

    -- Step 4: Compare the question's rank with the student's cap.
    RETURN v_question_rank <= v_question_cap;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to get details of all question banks for a given grade and subject
CREATE OR REPLACE FUNCTION get_question_banks_with_details(p_grade INT, p_subject TEXT)
RETURNS TABLE (
    id BIGINT,
    bank_key TEXT,
    display_name TEXT,
    grade INT,
    subject TEXT,
    book TEXT,
    chapter TEXT,
    topic TEXT,
    keywords TEXT, -- Change 1: Added keywords
    question_count JSONB, -- Change 2: Changed type to JSONB
    within_current_plan BOOLEAN
) AS $$
DECLARE
    v_question_cap INT;
BEGIN
    -- Step 1: Get the current user's question cap. (Unchanged)
    SELECT sp.question_cap
    INTO v_question_cap
    FROM subscriptions s
    JOIN subscription_plans sp ON s.subscription_plan = sp.plan_name
    WHERE s.student_id = auth.uid()
      AND s.grade = p_grade
      AND s.subject = p_subject
      AND s.subscription_ends_at > now();

    v_question_cap := COALESCE(v_question_cap, 0);

    -- Step 2: Return the query with all the required information.
    -- We use Common Table Expressions (CTEs) for clarity.
    RETURN QUERY
    WITH ranked_questions AS (
        -- First, rank all questions and get their type
        SELECT
            q.id,
            q.question_bank_id,
            q.question_type, -- Needed for type-based counting
            ROW_NUMBER() OVER (ORDER BY q.id ASC) as rn
        FROM questions q
        JOIN question_banks qb ON q.question_bank_id = qb.id
        WHERE qb.grade = p_grade AND qb.subject = p_subject
    ),
    bank_type_counts AS (
        -- CTE to get counts for each question_type per bank
        SELECT
            question_bank_id,
            question_type,
            COUNT(*) AS type_count
        FROM ranked_questions
        GROUP BY question_bank_id, question_type
    ),
    bank_json_stats AS (
        -- Change 2: CTE to aggregate type counts into the required JSON object
        SELECT
            question_bank_id,
            -- Aggregate all types into a JSON object
            jsonb_object_agg(question_type, type_count) ||
            -- Add the 'Total' key by summing all type counts
            jsonb_build_object('Total', SUM(type_count)) AS q_counts_json
        FROM bank_type_counts
        GROUP BY question_bank_id
    ),
    bank_rank_stats AS (
        -- CTE to get the minimum question rank for each bank
        SELECT
            question_bank_id,
            MIN(rn) AS min_question_rank
        FROM ranked_questions
        GROUP BY question_bank_id
    )
    -- Finally, join the base question_banks table with our calculated stats.
    SELECT
        qb.id,
        qb.bank_key,
        qb.display_name,
        qb.grade,
        qb.subject,
        qb.book,
        qb.chapter,
        qb.topic,
        qb.keywords, -- Change 1: Added keywords column
        bjs.q_counts_json AS question_count, -- Change 2: Use the new JSON stats
        -- A bank is "within the plan" if its first question's rank is within the user's cap.
        (brs.min_question_rank <= v_question_cap) AS within_current_plan
    FROM question_banks qb
    -- Join our two separate stats tables
    JOIN bank_json_stats bjs ON qb.id = bjs.question_bank_id
    JOIN bank_rank_stats brs ON qb.id = brs.question_bank_id
    WHERE qb.grade = p_grade AND qb.subject = p_subject
    -- Change 3: Order by plan status (true first), then by display name (A-Z)
    ORDER BY within_current_plan DESC, qb.display_name ASC;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to assist get_custom_question_set
CREATE OR REPLACE FUNCTION filter_questions(
    p_questions_json JSONB,
    p_criteria JSONB DEFAULT NULL,
    p_shuffle BOOLEAN DEFAULT TRUE
)
-- Define the return structure explicitly
RETURNS TABLE (
    bank_id BIGINT,
    display_name TEXT,
    q_id BIGINT,
    question_text TEXT,
    q_type TEXT,
    difficulty_level SMALLINT,
    details JSONB
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_json_type TEXT;
BEGIN
    -- Determine the criteria form (or if it's null)
    IF p_criteria IS NULL OR p_criteria = 'null'::jsonb OR p_criteria = '{}'::jsonb THEN
        v_json_type := 'null';
    ELSE
        -- Check the type of the first value to see if it's
        -- Form 1 ({"1": {...}}) or Form 2 ({"MCQ": 5})
        SELECT jsonb_typeof(value)
        INTO v_json_type
        FROM jsonb_each(p_criteria)
        LIMIT 1;
    END IF;

    -- STEP 2: Handle NULL criteria
    IF v_json_type = 'null' THEN
        RETURN QUERY
        WITH source_questions AS (
            -- Unpack the JSON into a recordset
            SELECT *
            FROM jsonb_to_recordset(p_questions_json) AS q(
                qb_id BIGINT, display_name TEXT, q_id BIGINT,
                question_text TEXT, q_type TEXT,
                difficulty_level SMALLINT, details JSONB
            )
        )
        -- Apply shuffle/sort and return everything
        SELECT s.*
        FROM source_questions s
        ORDER BY
            CASE WHEN p_shuffle THEN random() ELSE NULL::float END,
            CASE WHEN NOT p_shuffle THEN s.q_id ELSE NULL::bigint END;
        RETURN;
    END IF;

    -- STEP 3: Handle Form 1 Criteria (by-bank)
    IF v_json_type = 'object' THEN
        RETURN QUERY
        WITH
        -- Unpack JSON and apply initial shuffle/sort, capturing the
        -- order with row_number()
        ordered_questions AS (
            SELECT q.*,
                   row_number() OVER (
                        ORDER BY
                            CASE WHEN p_shuffle THEN random() ELSE NULL::float END,
                            CASE WHEN NOT p_shuffle THEN q.q_id ELSE NULL::bigint END
                   ) as rn
            FROM jsonb_to_recordset(p_questions_json) AS q(
                qb_id BIGINT, display_name TEXT, q_id BIGINT,
                question_text TEXT, q_type TEXT,
                difficulty_level SMALLINT, details JSONB
            )
        ),
        -- Expand the JSON criteria into a relational table
        criteria AS (
            SELECT
                bank.key::bigint AS req_qb_id,
                type.key AS req_q_type,
                type.value::int AS req_count
            FROM
                jsonb_each(p_criteria) AS bank,
                jsonb_each(bank.value) AS type
        ),
        -- Number each question *within* its (bank, type) group,
        -- respecting the original shuffle/sort order (ORDER BY q.rn)
        numbered_questions AS (
            SELECT
                q.*,
                row_number() OVER (
                    PARTITION BY q.qb_id, q.q_type
                    ORDER BY q.rn -- Use the pre-calculated order
                ) AS type_rn
            FROM ordered_questions q
        )
        -- Final selection:
        SELECT
            q.qb_id, q.display_name, q.q_id, q.question_text, q.q_type, q.difficulty_level, q.details
        FROM numbered_questions q
        JOIN criteria c
            ON q.qb_id = c.req_qb_id AND q.q_type = c.req_q_type
        WHERE
            q.type_rn <= c.req_count
        ORDER BY
            q.rn; -- Return results in the original shuffled/sorted order
        RETURN;
    END IF;

    -- STEP 4: Handle Form 2 Criteria (by-type, interlaced)
    IF v_json_type = 'number' THEN
        RETURN QUERY
        WITH
        -- Unpack JSON and apply initial shuffle/sort
        ordered_questions AS (
            SELECT q.*,
                   row_number() OVER (
                        ORDER BY
                            CASE WHEN p_shuffle THEN random() ELSE NULL::float END,
                            CASE WHEN NOT p_shuffle THEN q.q_id ELSE NULL::bigint END
                   ) as rn
            FROM jsonb_to_recordset(p_questions_json) AS q(
                qb_id BIGINT, display_name TEXT, q_id BIGINT,
                question_text TEXT, q_type TEXT,
                difficulty_level SMALLINT, details JSONB
            )
        ),
        -- Expand criteria into a table
        criteria AS (
            SELECT
                crit.key AS req_q_type,
                crit.value::int AS req_count
            FROM jsonb_each(p_criteria) AS crit
        ),
        -- Find all distinct banks *present in the input*
        distinct_banks AS (
            SELECT
                qb_id,
                row_number() OVER (ORDER BY qb_id) AS bank_index,
                count(*) OVER () AS total_banks
            FROM (
                SELECT DISTINCT qb_id FROM ordered_questions
            ) db
        ),
        -- Number questions within their (type, bank) group
        numbered_questions AS (
            SELECT
                q.*,
                row_number() OVER (
                    PARTITION BY q.q_type, q.qb_id
                    ORDER BY q.rn -- Preserve original order
                ) AS q_num_in_bank_type,
                db.bank_index,
                db.total_banks
            FROM ordered_questions q
            JOIN distinct_banks db ON q.qb_id = db.qb_id
        ),
        -- Calculate a global "interlaced" rank
        interlaced_rank AS (
            SELECT
                q.*,
                ( (q.q_num_in_bank_type - 1) * q.total_banks + q.bank_index ) AS global_interlace_rank
            FROM numbered_questions q
        )
        -- Final selection
        SELECT
            q.qb_id, q.display_name, q.q_id, q.question_text, q.q_type, q.difficulty_level, q.details
        FROM interlaced_rank q
        JOIN criteria c
            ON q.q_type = c.req_q_type
        WHERE
            q.global_interlace_rank <= c.req_count
        ORDER BY
            q.rn; -- Return in the original order
        RETURN;
    END IF;

END;
$$;

-- Function to fetch questions based on supplied parameters
CREATE OR REPLACE FUNCTION get_custom_question_set(
    p_bank_ids BIGINT[],
    p_bank_counts JSONB DEFAULT NULL,
    p_type_counts JSONB DEFAULT NULL,
    p_shuffle BOOLEAN DEFAULT TRUE,
    p_total_count INT DEFAULT 10
)
RETURNS TABLE (
    question_bank_id BIGINT,
    question_bank TEXT,
    question TEXT,
    question_type TEXT,
    difficulty_level SMALLINT,
    details JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    -- Original variable
    v_max_limit INT;

    -- NEW: Variables for quota checking
    v_student_id UUID := auth.uid();
    v_grade INT;
    v_subject TEXT;
    v_quota_limit INT;
    v_quota_period TEXT;
    v_current_period_start DATE;
    v_questions_used INT;
    v_questions_remaining INT;
    v_actual_questions_retrieved INT;
    v_criteria JSONB;
BEGIN
    -- Use a temp table to store results before returning
    -- This allows us to get an
    -- accurate count for logging.
    CREATE TEMPORARY TABLE tmp_results (
        question_bank_id BIGINT,
        question_bank TEXT,
        question TEXT,
        question_type TEXT,
        difficulty_level SMALLINT,
        details JSONB
    ) ON COMMIT DROP;

    -- 1. Check if the user is authenticated
    IF v_student_id IS NULL THEN
        RETURN;
    END IF;

    -- 2. This check prevents a division by zero error if an empty array is passed
    IF array_length(p_bank_ids, 1) IS NULL OR array_length(p_bank_ids, 1) = 0 THEN
        RETURN;
    END IF;

    -- ---
    -- 3. NEW: Get Quota Context
    -- We assume all banks in the array are for the same grade/subject.
    -- We'll check the context from the first bank ID.
    -- ---
    SELECT grade, subject
    INTO v_grade, v_subject
    FROM question_banks
    WHERE id = p_bank_ids[1]; -- Get context from the first bank

    IF NOT FOUND THEN
        RETURN; -- No valid bank ID provided
    END IF;

    -- ---
    -- 4. NEW: Get Student's Quota Limit for this Context
    -- ---
    SELECT
        sp.quota_limit,
        sp.quota_period
    INTO
        v_quota_limit,
        v_quota_period
    FROM subscriptions s
    JOIN subscription_plans sp ON s.subscription_plan = sp.plan_name
    WHERE s.student_id = v_student_id
      AND s.grade = v_grade
      AND s.subject = v_subject
      AND s.subscription_ends_at > now(); -- Ensure subscription is active

    IF NOT FOUND THEN
        -- No active, specific subscription. Try to find the 'Free' plan as a fallback.
        SELECT sp.quota_limit, sp.quota_period
        INTO v_quota_limit, v_quota_period
        FROM subscription_plans sp
        WHERE sp.plan_name = 'Free';
    END IF;

    -- Default to 'no limit' if no plan was found or plan has no quota
    v_quota_limit := COALESCE(v_quota_limit, 0);
    v_quota_period := COALESCE(v_quota_period, 'none');

    -- ---
    -- 5. NEW: Check Quota Usage
    -- ---
    v_questions_remaining := 999999; -- Default to a "no limit" large number

    IF v_quota_period IN ('day', 'month', 'week') AND v_quota_limit > 0 THEN
        -- Calculate the start of the current quota period
        v_current_period_start := date_trunc(v_quota_period, now())::date;

        -- Find how many questions the student has already used in this period
        SELECT questions_retrieved
        INTO v_questions_used
        FROM student_quota_usage
        WHERE student_id = v_student_id
          AND grade = v_grade
          AND subject = v_subject
          AND period_start_date = v_current_period_start;

        IF NOT FOUND THEN
            v_questions_used := 0;
        END IF;

        -- Calculate remaining quota
        v_questions_remaining := v_quota_limit - v_questions_used;

        -- If quota is exhausted, return empty set
        IF v_questions_remaining <= 0 THEN
            RETURN;
        END IF;
    END IF;

    -- 6. Enforce the hard limit (Original logic)
    SELECT limit_number
    INTO v_max_limit
    FROM hard_limits
    WHERE limit_name = 'max_questions_per_retrieval';

    -- ---
    -- 7. NEW: Cap the final count
    -- The total count will be the *smallest* of:
    --   1. What the user asked for (p_total_count)
    --   2. The system hard limit (v_max_limit)
    --   3. The user's remaining quota (v_questions_remaining)
    -- ---
    p_total_count := LEAST(p_total_count, v_max_limit, v_questions_remaining);

    -- If the final capped count is 0 or less, return empty
    IF p_total_count <= 0 THEN
        RETURN;
    END IF;

    v_criteria := COALESCE(p_bank_counts, p_type_counts);

    -- ---
    -- 8. Main Query: Fetch questions into the temp table
    --
    -- NEW LOGIC: To ensure predictable row counts, we *first* build a
    -- deterministic "pool" of questions that meet *all* criteria
    -- (bank count, type count), and *then* apply the shuffle and
    -- final limit to that stable pool.
    -- ---
    INSERT INTO tmp_results
    WITH all_eligible_questions AS (
        -- Step 1: Get all questions user has access to.
        -- NO shuffling here. We need a stable set for filtering.
        SELECT
            qb.id AS qb_id,
            qb.display_name,
            q.id AS q_id,
            q.question_text,
            q.question_type AS q_type,
            q.difficulty_level,
            q.details
        FROM questions q
        JOIN question_banks qb ON q.question_bank_id = qb.id
        WHERE q.question_bank_id = ANY(p_bank_ids)
          AND check_question_access(q.id) -- Original access check
    ),

-- *** STEP 2: CALL TO filter_questions FUNCTION ***
    -- We aggregate all eligible questions into a single JSONB array
    -- and pass it to the filter function along with the criteria
    -- and shuffle parameters.
    filtered_pool AS (
        SELECT *
        FROM filter_questions(
            (SELECT jsonb_agg(q) FROM all_eligible_questions q),
            v_criteria,
            p_shuffle -- Pass the parent's shuffle flag
        )
    )
    
    -- Step 3: NOW shuffle the *final pool* if requested,
    -- and apply the total limit.
    SELECT
        fp.bank_id AS qb_id,
        fp.display_name,
        fp.question_text,
        fp.q_type,
        fp.difficulty_level,
        fp.details
    FROM filtered_pool fp
    -- The shuffle/order is applied *after* all filtering.
    ORDER BY
        CASE
            WHEN p_shuffle THEN random()
            ELSE fp.q_id -- Deterministic order if no shuffle
        END
    LIMIT p_total_count; -- This is the final, capped limit

    -- ---
    -- 9. NEW: Log the actual number of questions retrieved
    -- ---
    GET DIAGNOSTICS v_actual_questions_retrieved = ROW_COUNT;

    IF v_actual_questions_retrieved > 0 AND v_quota_period IN ('day', 'month', 'week') THEN
        -- Insert or update the usage count.
        -- This is atomic and safe from race conditions.
        INSERT INTO student_quota_usage (
            student_id,
            grade,
            subject,
            period_start_date,
            questions_retrieved
        )
        VALUES (
            v_student_id,
            v_grade,
            v_subject,
            v_current_period_start,
            v_actual_questions_retrieved
        )
        ON CONFLICT (student_id, grade, subject, period_start_date)
        DO UPDATE SET
            questions_retrieved = student_quota_usage.questions_retrieved + EXCLUDED.questions_retrieved;
    END IF;

    -- ---
    -- 10. Return the final set of questions from the temp table
    -- ---
    RETURN QUERY SELECT * FROM tmp_results;

END;
$$;






-- =========================
-- TRIGGER FUNCTIONS
-- =========================

-- Auto-create settings for a new student
CREATE OR REPLACE FUNCTION create_settings_for_student()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO settings (student_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$;

-- Set default avatar
CREATE OR REPLACE FUNCTION set_default_avatar()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    student_gender TEXT;
BEGIN
    -- The avatar column is defined as NOT NULL in the settings table.
    -- This check for NULL might be redundant unless you plan to change the table definition.
    -- However, it is good practice to keep it.
    -- We also need to handle the case where the INSERT statement explicitly sets avatar to NULL.
    IF NEW.avatar IS NULL THEN
        SELECT gender INTO student_gender FROM students WHERE id = NEW.student_id;

        IF student_gender = 'F' THEN
            NEW.avatar := 'avatarStyle=Circle&topType=LongHairStraight&hairColor=BrownDark&clotheType=BlazerSweater&eyeType=Happy&mouthType=Smile&skinColor=Light';
        ELSE
            NEW.avatar := 'avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Automatically insert a personalized welcome message when a new student registers
CREATE OR REPLACE FUNCTION log_welcome_notification()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
DECLARE
  first_name TEXT;
BEGIN
  -- Extract first name and capitalize properly
  first_name := INITCAP(SPLIT_PART(LOWER(NEW.name), ' ', 1));

  -- Insert personalized welcome message
  INSERT INTO notifications (
    message_title,
    message_body,
    detailed_message,
    target_type,
    target_tokens,
    sent_by
  )
  VALUES (
    'Welcome to JVP Spark!',
    'Welcome aboard JVP Spark — your personal hub for learning, creativity, and achievements. Let’s make every day count!',
    FORMAT(
      'Dear %s,

*JVP Spark is your unified school app, bringing everything you need in one place!* 

Access results, exam syllabus, blueprints, and explore interactive tools like games, quizzes, and memory challenges that make learning truly joyful.

*Getting Started:*

1. Find all general resources (exam blueprints, results, memory games, etc.) under the “General” tab.

2. Explore subject-specific content like worksheets and quizzes in each subject’s tab. for example, all Computer Science resources in the “Computer” tab.

3. We’re constantly adding new subjects and features, so stay tuned!

Make the most of JVP Spark and keep learning with enthusiasm.
All the best!


Best wishes,
Sourabh
Educator & Developer',
      first_name
    ),
    'token',
    jsonb_build_array(NEW.access_token),
    'Sourabh Sir'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Auto-subscribe Jamna Vidyapeeth students
CREATE OR REPLACE FUNCTION handle_new_student_subscriptions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subjects      TEXT[];
    subject_name  TEXT;
BEGIN
    IF NEW.school = 'Jamna Vidyapeeth' THEN
        -- Add "General" subscription if not exists
        IF NOT EXISTS (
            SELECT 1 FROM subscriptions
            WHERE student_id = NEW.id AND subject = 'General'
        ) THEN
            INSERT INTO subscriptions (student_id, grade, subject)
            VALUES (NEW.id, NEW.grade, 'General');
        END IF;

        -- Determine subjects list
        subjects :=
            CASE NEW.grade
                WHEN 1 THEN ARRAY['English','Hindi','Maths','EVS','Computer','GK']
                WHEN 2 THEN ARRAY['English','Hindi','Maths','EVS','Computer','GK']
                WHEN 3 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Computer','GK']
                WHEN 4 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Computer','GK']
                WHEN 5 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Computer','GK']
                WHEN 6 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Sanskrit','Computer','GK']
                WHEN 7 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Sanskrit','Computer','GK']
                WHEN 8 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Sanskrit','Data Science','GK']
                WHEN 9 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Data Science']
                WHEN 10 THEN ARRAY['English','Hindi','Maths','Science','Social Science','Data Science']
                WHEN 11 THEN
                    CASE NEW.section
                        WHEN 'SCI' THEN ARRAY['English','Physics','Chemistry','Biology','Maths','P.E.','I.P.','Geography','Economics','Psychology','Fine Arts']
                        WHEN 'COM' THEN ARRAY['English','Accountancy','B.St.','Economics','Maths','P.E.','I.P.','Applied Maths','Psychology','Fine Arts']
                        WHEN 'HUM' THEN ARRAY['English','History','Geography','Pol. Sci.','Maths','P.E.','I.P.','Economics','Applied Maths','Psychology','Fine Arts']
                        ELSE ARRAY[]::TEXT[]
                    END
                WHEN 12 THEN
                    CASE NEW.section
                        WHEN 'SCI' THEN ARRAY['English','Physics','Chemistry','Biology','Maths','P.E.','I.P.','Geography','Economics']
                        WHEN 'COM' THEN ARRAY['English','Accountancy','B.St.','Economics','Maths','P.E.','I.P.']
                        WHEN 'HUM' THEN ARRAY['English','History','Geography','Pol. Sci.','Maths','P.E.','I.P.','Economics']
                        ELSE ARRAY[]::TEXT[]
                    END
                ELSE ARRAY[]::TEXT[]
            END;

        -- Insert subject subscriptions
        IF array_length(subjects, 1) > 0 THEN
            FOREACH subject_name IN ARRAY subjects LOOP
                INSERT INTO subscriptions (student_id, grade, subject)
                VALUES (NEW.id, NEW.grade, subject_name);
            END LOOP;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Function to return a specific notification (only if a student is eligible for this notification)
CREATE OR REPLACE FUNCTION get_specific_notification(p_notification_id text)
RETURNS TABLE (
    id uuid,
    created_at timestamp,
    message_title text,
    message_body text,
    detailed_message text,
    target_type text,
    target_tokens jsonb,
    targeted_recipients integer,
    success_count integer,
    sent_by text
)
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_id uuid;
    v_student_grade int;
    v_student_section text;
    v_student_access_token uuid;
    v_target_type text;
    v_target_tokens jsonb;
    v_is_eligible boolean := false;
    v_grade_section text;
BEGIN
    -- Get the authenticated user's ID
    v_student_id := auth.uid();

    -- If no authenticated user, return nothing
    IF v_student_id IS NULL THEN
        RETURN;
    END IF;

    -- Get student details
    SELECT s.grade, s.section, s.access_token
    INTO v_student_grade, v_student_section, v_student_access_token
    FROM students s
    WHERE s.id = v_student_id;

    -- If student not found, return nothing
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Get notification details
    SELECT nl.target_type, nl.target_tokens
    INTO v_target_type, v_target_tokens
    FROM notifications nl
    WHERE nl.id = p_notification_id::uuid;

    -- If notification not found, return nothing
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Check eligibility based on target_type
    CASE v_target_type
        WHEN 'all' THEN
            v_is_eligible := true;

        WHEN 'token' THEN
            v_is_eligible := v_target_tokens ? v_student_access_token::text;

        WHEN 'grade' THEN
            -- This check now works for both numbers (e.g., [6]) and strings (e.g., ["6"])
            SELECT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(v_target_tokens) AS elem
                WHERE elem = v_student_grade::text
            ) INTO v_is_eligible;

        WHEN 'grade-section' THEN
            v_grade_section := v_student_grade::text || '-' || v_student_section;
            -- This check is robust for grade-section strings
            SELECT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(v_target_tokens) AS elem
                WHERE elem = v_grade_section
            ) INTO v_is_eligible;

        ELSE
            v_is_eligible := false;
    END CASE;

    -- If eligible, return the notification
    IF v_is_eligible THEN
        RETURN QUERY
        SELECT
            nl.id,
            nl.created_at,
            nl.message_title,
            nl.message_body,
            nl.detailed_message,
            nl.target_type,
            nl.target_tokens,
            nl.targeted_recipients,
            nl.success_count,
            nl.sent_by
        FROM notifications nl
        WHERE nl.id = p_notification_id::uuid;
    END IF;

    RETURN;
END;
$$;



-- =========================
-- TRIGGERS
-- =========================
CREATE TRIGGER after_student_insert_create_settings
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION create_settings_for_student();

CREATE TRIGGER after_settings_created_set_default_avatar
BEFORE INSERT ON settings
FOR EACH ROW
EXECUTE FUNCTION set_default_avatar();

CREATE TRIGGER after_student_insert_create_subscriptions
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION handle_new_student_subscriptions();

CREATE TRIGGER after_student_insert_log_welcome_msg
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION log_welcome_notification();


-- =========================
-- RLS POLICIES
-- =========================

-- Hard limits
ALTER TABLE hard_limits ENABLE ROW LEVEL SECURITY;

-- Subscription plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Student quota usage
ALTER TABLE student_quota_usage ENABLE ROW LEVEL SECURITY;

-- Question banks
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read question banks"
    ON question_banks FOR SELECT
    TO authenticated
    USING (true);

-- Questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;


-- Menu resources
ALTER TABLE menu_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read resources"
    ON menu_resources FOR SELECT
    TO authenticated
    USING (true);

-- Subject resources
ALTER TABLE subject_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read resources"
    ON subject_resources FOR SELECT
    TO authenticated
    USING (true);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read only their own notifications"
ON notifications
FOR SELECT
USING (
    -- Rule 1: Allow if target is 'all'
    (target_type = 'all')

    OR

    -- Rule 2: Allow if target is 'grade' and student's grade is in the list
    (
        target_type = 'grade' AND
        target_tokens @> to_jsonb(ARRAY[(SELECT grade FROM students WHERE id = auth.uid())])
    )

    OR

    -- Rule 3: Allow if target is 'grade-section' and student's G-S is in the list
    (
        target_type = 'grade-section' AND
        target_tokens @> to_jsonb(ARRAY[(SELECT grade::text || '-' || section FROM students WHERE id = auth.uid())])
    )

    OR

    -- Rule 4: Allow if target is 'token' and student's access_token is in the list
    (
        target_type = 'token' AND
        target_tokens @> to_jsonb(ARRAY[(SELECT access_token::text FROM students WHERE id = auth.uid())])
    )
);

-- Notification read logs
ALTER TABLE notification_read_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read only their own notification read logs"
    ON notification_read_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert only their own notification read logs"
    ON notification_read_logs
    FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update only their own notification read logs"
    ON notification_read_logs
    FOR UPDATE
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());


-- Teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage their own data"
    ON students FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage their own settings"
    ON settings FOR ALL
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Push subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage their own push notification subscriptions"
    ON push_subscriptions FOR ALL
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);


-- =========================
-- INSERT INITIAL SEED DATA
-- =========================

-- Menu resources for navigation drawer
INSERT INTO menu_resources (
    title,
    icon,
    page_key,
    link,
    display_order
)
VALUES
    ('Dashboard',     'home',               'dashboard',      '',                                      1),
    ('My Progress',   'bar-chart',  'my-progress',    'pages/coming-soon/index.html',      2),
    ('Notifications', 'notifications',      'notifications',  'pages/notifications/index.html',        3),
    ('Subscriptions',   'ribbon',  'subscriptions',    'pages/coming-soon/index.html',      4),
    ('Settings',      'settings',           'settings',       'pages/account/index.html',              5),
    ('Developer',     'code',       'about-developer','pages/about-developer/index.html',      6);

-- General tab resources for dashboard
INSERT INTO subject_resources (
    subject,
    grade,
    title,
    icon,
    page_key,
    link,
    min_width,
    display_order,
    extra
)
VALUES
    -- Common resources (grade is NULL, subject is General so they appear for any subscribed grade)
    (
        'General', 
        NULL, 
        'My Result', 
        'podium-outline', 
        'result', 
        'pages/result/index.html', 
        NULL, 
        1, 
        '{"jvpOnly": true}'
    ),
    (
        'General', 
        NULL, 
        'My Attendance', 
        'calendar-clear-outline', 
        'attendance', 
        'pages/coming-soon/index.html', 
        NULL, 
        2, 
        '{"jvpOnly": true}'
    ),
    (
        'General', 
        NULL, 
        'Syllabus', 
        'clipboard-outline', 
        'syllabus', 
        'pages/syllabus/index.html?exam=Term-1', 
        NULL, 
        3, 
        '{"jvpOnly": true}'
    ),
    (
        'General', 
        NULL, 
        'Blueprint', 
        'reader-outline', 
        'blueprint', 
        'pages/blueprint/index.html?exam=Term-1', 
        NULL, 
        4, 
        '{"jvpOnly": true}'
    ),
    (
        'General', 
        NULL, 
        'File Vault', 
        'folder-open-outline', 
        'vault', 
        'https://drive.google.com/embeddedfolderview?id=13PUh09AAJn7DLlhAxflcOSE_uQo3im_N', 
        NULL, 
        5, 
        '{"jvpOnly": true, "forcedTheme": "light"}'
    ),
    (
        'General', 
        NULL, 
        'Word of the Day', 
        'language', 
        'word-of-the-day', 
        NULL, 
        NULL, 
        6, 
        NULL
    ),
    (
        'General', 
        NULL, 
        'Sarthak AI', 
        'chatbubble-outline', 
        'sarthak', 
        'pages/sarthak/index.html', 
        NULL, 
        7, 
        NULL
    ),
    (
        'General', 
        NULL, 
        'Memory Game', 
        'albums-outline', 
        'flashcard-memory-game', 
        'pages/flashcard-memory-game/index.html', 
        NULL, 
        8, 
        NULL
    ),
    (
        'General', 
        NULL, 
        'Focus Builder', 
        'bulb-outline', 
        'color-meaning-game', 
        'pages/color-meaning-game/index.html', 
        NULL, 
        9, 
        NULL
    ),
    (
        'General', 
        NULL, 
        'Rabbit Run', 
        'paw-outline', 
        'rabbit-run-game', 
        'pages/rabbit-run-game/index.html', 
        NULL, 
        10, 
        NULL
    ),
    (
        'General', 
        NULL, 
        'Rubic Cube', 
        'cube-outline', 
        'rubic-cube-game', 
        'pages/rubic-cube-game/index.html', 
        NULL, 
        11, 
        '{"forcedTheme": "light"}'
    );

-- Subject specific resources
INSERT INTO subject_resources (
    subject,
    grade,
    title,
    icon,
    page_key,
    link,
    min_width,
    display_order,
    extra
)
VALUES
(
        'English', 
        6, 
        'Quiz', 
        'help-outline', 
        '6-english-quiz', 
        'pages/quiz/index.html', 
        NULL, 
        1, 
        '{"qbRequired": true, "allowedQTypes": ["MCQ", "True/False"]}'
);

INSERT INTO subject_resources (
    subject,
    grade,
    title,
    icon,
    page_key,
    link,
    min_width,
    display_order,
    extra
)
VALUES
(
        'English', 
        6, 
        'Worksheet', 
        'newspaper-outline', 
        '6-english-worksheet', 
        'pages/worksheet/index.html', 
        NULL, 
        2, 
        '{"qbRequired": true, "allowedQTypes": "all"}'
);

INSERT INTO subject_resources (
    subject,
    grade,
    title,
    icon,
    page_key,
    link,
    min_width,
    display_order,
    extra
)
VALUES
(
        'Computer', 
        6, 
        'Quiz', 
        'help-outline', 
        '6-computer-quiz', 
        'pages/quiz/index.html', 
        NULL, 
        1, 
        '{"qbRequired": true, "allowedQTypes": ["MCQ", "True/False"]}'
);

INSERT INTO subject_resources (
    subject,
    grade,
    title,
    icon,
    page_key,
    link,
    min_width,
    display_order,
    extra
)
VALUES
(
        'Computer', 
        6, 
        'Worksheet', 
        'newspaper-outline', 
        '6-computer-worksheet', 
        'pages/worksheet/index.html', 
        NULL, 
        2, 
        '{"qbRequired": true, "allowedQTypes": "all"}'
);


-- Impose hard limits
INSERT INTO hard_limits (limit_name, limit_number, description)
VALUES
  ('max_questions_per_retrieval', 100, 'Only 100 questions can be retrieved in a single call.');

-- Available subscription plans
INSERT INTO subscription_plans (plan_name, question_cap, description, quota_period, quota_limit)
VALUES
    ('Free', 50, 'Access to the first 50 questions per subject.', 'day', 25),
    ('Basic', 150, 'Access to 150 questions per subject.', 'day', 250),
    ('Premium', 1000000, 'Effectively unlimited access to all questions.', 'day', 500); -- Use a very large number for unlimited

