-- Fix the user creation trigger to be more robust

DROP TRIGGER IF EXISTS create_profile_and_workspace_trigger ON auth.users;
DROP FUNCTION IF EXISTS create_profile_and_workspace();

CREATE OR REPLACE FUNCTION create_profile_and_workspace() 
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    random_username TEXT;
    profile_id UUID;
    workspace_id UUID;
BEGIN
    BEGIN
        -- Generate a random username
        random_username := 'user' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);
        
        -- Log the start of user creation
        RAISE LOG 'Creating profile and workspace for user: %', NEW.id;

        -- Create a profile for the new user with minimal required fields
        INSERT INTO public.profiles(
            user_id, 
            username,
            display_name,
            bio,
            profile_context,
            image_url,
            image_path,
            has_onboarded,
            use_azure_openai,
            anthropic_api_key,
            azure_openai_35_turbo_id,
            azure_openai_45_turbo_id,
            azure_openai_45_vision_id,
            azure_openai_api_key,
            azure_openai_endpoint,
            google_gemini_api_key,
            mistral_api_key,
            openai_api_key,
            openai_organization_id,
            perplexity_api_key
        )
        VALUES(
            NEW.id,
            random_username,
            '', -- display_name can be empty initially
            '', -- bio can be empty initially
            '', -- profile_context can be empty initially
            '', -- image_url can be empty initially
            '', -- image_path can be empty initially
            FALSE, -- has_onboarded
            FALSE, -- use_azure_openai
            '', -- anthropic_api_key
            '', -- azure_openai_35_turbo_id
            '', -- azure_openai_45_turbo_id
            '', -- azure_openai_45_vision_id
            '', -- azure_openai_api_key
            '', -- azure_openai_endpoint
            '', -- google_gemini_api_key
            '', -- mistral_api_key
            '', -- openai_api_key
            '', -- openai_organization_id
            '' -- perplexity_api_key
        )
        RETURNING id INTO profile_id;

        RAISE LOG 'Profile created with ID: %', profile_id;

        -- Create the home workspace for the new user
        INSERT INTO public.workspaces(
            user_id, 
            is_home, 
            name, 
            default_context_length, 
            default_model, 
            default_prompt, 
            default_temperature, 
            description, 
            embeddings_provider, 
            include_profile_context, 
            include_workspace_instructions, 
            instructions
        )
        VALUES(
            NEW.id,
            TRUE,
            'Home',
            4096,
            'gpt-4-1106-preview',
            'You are Talkiary, a thoughtful and gentle AI assistant who helps users reflect on their day, organize their thoughts, and express their emotions through writing.
Engage in warm, natural conversation while also assisting with creating and adjusting schedules.

When the user creates or requests a schedule, output it using a Markdown table with three columns: Time, Activity, and Note.
The table format must follow these rules:

Use vertical bars (|) to separate each column.

Include time in HH:MM format (e.g., 09:00).

After the header row, include a separator row like:
| --- | --- | --- |

You may freely combine the table with natural conversation.
Be flexible when the user requests changes to their schedule—modify, add, or remove activities as needed.',
            0.5,
            'My home workspace.',
            'openai',
            TRUE,
            TRUE,
            ''
        )
        RETURNING id INTO workspace_id;

        RAISE LOG 'Workspace created with ID: %', workspace_id;
        RAISE LOG 'Successfully created profile and workspace for user: %', NEW.id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error
            RAISE LOG 'ERROR creating profile and workspace for user %: % %', NEW.id, SQLSTATE, SQLERRM;
            
            -- Clean up any partial data
            DELETE FROM public.workspaces WHERE user_id = NEW.id;
            DELETE FROM public.profiles WHERE user_id = NEW.id;
            
            -- Re-raise the exception to prevent the user from being created
            RAISE;
    END;

    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Recreate the trigger
CREATE TRIGGER create_profile_and_workspace_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_profile_and_workspace();

-- The required columns already exist in later migrations, so no need to add them here