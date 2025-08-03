"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId
} from "@/db/workspaces"
import {
  fetchHostedModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { APIStep } from "../../../components/setup/api-step"
import { FinishStep } from "../../../components/setup/finish-step"
import { ProfileStep } from "../../../components/setup/profile-step"
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../../components/setup/step-container"

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setEnvKeyMap,
    setAvailableHostedModels,
    setAvailableOpenRouterModels
  } = useContext(ChatbotUIContext)

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [currentStep, setCurrentStep] = useState(1)

  // Profile Step
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState(false)

  // API Step
  const [useAzureOpenai, setUseAzureOpenai] = useState(false)
  const [openaiAPIKey, setOpenaiAPIKey] = useState("")
  const [openaiOrgID, setOpenaiOrgID] = useState("")
  const [azureOpenaiAPIKey, setAzureOpenaiAPIKey] = useState("")
  const [azureOpenaiEndpoint, setAzureOpenaiEndpoint] = useState("")
  const [azureOpenai35TurboID, setAzureOpenai35TurboID] = useState("")
  const [azureOpenai45TurboID, setAzureOpenai45TurboID] = useState("")
  const [azureOpenai45VisionID, setAzureOpenai45VisionID] = useState("")
  const [azureOpenaiEmbeddingsID, setAzureOpenaiEmbeddingsID] = useState("")
  const [anthropicAPIKey, setAnthropicAPIKey] = useState("")
  const [googleGeminiAPIKey, setGoogleGeminiAPIKey] = useState("")
  const [mistralAPIKey, setMistralAPIKey] = useState("")
  const [groqAPIKey, setGroqAPIKey] = useState("")
  const [perplexityAPIKey, setPerplexityAPIKey] = useState("")
  const [openrouterAPIKey, setOpenrouterAPIKey] = useState("")

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        const user = session.user

        try {
          const profile = await getProfileByUserId(user.id)
          setProfile(profile)
          setUsername(profile.username)

          if (!profile.has_onboarded) {
            setLoading(false)
          } else {
            const data = await fetchHostedModels(profile)

            if (!data) return

            setEnvKeyMap(data.envKeyMap)
            setAvailableHostedModels(data.hostedModels)

            if (profile["openrouter_api_key"] || data.envKeyMap["openrouter"]) {
              const openRouterModels = await fetchOpenRouterModels()
              if (!openRouterModels) return
              setAvailableOpenRouterModels(openRouterModels)
            }

            try {
              const homeWorkspaceId = await getHomeWorkspaceByUserId(
                session.user.id
              )
              return router.push(`/${homeWorkspaceId}/chat`)
            } catch (workspaceError) {
              console.error(
                "No home workspace found, staying on setup:",
                workspaceError
              )
              // If no home workspace exists, stay on setup to allow user to complete onboarding
              setLoading(false)
            }
          }
        } catch (error) {
          console.error("Profile not found during setup:", error)
          // If profile doesn't exist, allow user to go through setup
          setLoading(false)
        }
      }
    })()
  }, [])

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === SETUP_STEP_COUNT) {
        handleSaveSetupSetting()
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveSetupSetting = async () => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      return router.push("/login")
    }

    const user = session.user

    let profile
    try {
      profile = await getProfileByUserId(user.id)
    } catch (error) {
      console.error("Profile not found, redirecting to login:", error)
      return router.push(
        "/login?message=Profile not found. Please sign up again."
      )
    }

    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,
      has_onboarded: true,
      display_name: displayName,
      username,
      openai_api_key: openaiAPIKey,
      openai_organization_id: openaiOrgID,
      anthropic_api_key: anthropicAPIKey,
      google_gemini_api_key: googleGeminiAPIKey,
      mistral_api_key: mistralAPIKey,
      groq_api_key: groqAPIKey,
      perplexity_api_key: perplexityAPIKey,
      openrouter_api_key: openrouterAPIKey,
      use_azure_openai: useAzureOpenai,
      azure_openai_api_key: azureOpenaiAPIKey,
      azure_openai_endpoint: azureOpenaiEndpoint,
      azure_openai_35_turbo_id: azureOpenai35TurboID,
      azure_openai_45_turbo_id: azureOpenai45TurboID,
      azure_openai_45_vision_id: azureOpenai45VisionID,
      azure_openai_embeddings_id: azureOpenaiEmbeddingsID
    }

    const updatedProfile = await updateProfile(profile.id, updateProfilePayload)
    setProfile(updatedProfile)

    const workspaces = await getWorkspacesByUserId(profile.user_id)
    let homeWorkspace = workspaces.find(w => w.is_home)

    // If no home workspace exists, create one
    if (!homeWorkspace) {
      console.log("No home workspace found, creating one...")
      const { createWorkspace } = await import("@/db/workspaces")
      homeWorkspace = await createWorkspace({
        user_id: user.id,
        is_home: true,
        name: "Home",
        default_context_length: 4096,
        default_model: "gpt-4-1106-preview",
        default_prompt: `You are Talkiary, a thoughtful and gentle AI assistant who helps users reflect on their day, organize their thoughts, and express their emotions through writing.
Engage in warm, natural conversation while also assisting with creating and adjusting schedules.

When the user creates or requests a schedule, output it using a Markdown table with three columns: Time, Activity, and Note.
The table format must follow these rules:

Use vertical bars (|) to separate each column.

Include time in HH:MM format (e.g., 09:00).

After the header row, include a separator row like:
| --- | --- | --- |

You may freely combine the table with natural conversation.
Be flexible when the user requests changes to their schedule—modify, add, or remove activities as needed.`,
        default_temperature: 0.5,
        description: "My home workspace.",
        embeddings_provider: "openai",
        include_profile_context: true,
        include_workspace_instructions: true,
        instructions: ""
      })
      const updatedWorkspaces = await getWorkspacesByUserId(profile.user_id)
      setWorkspaces(updatedWorkspaces)
    } else {
      setWorkspaces(workspaces)
    }

    setSelectedWorkspace(homeWorkspace)

    return router.push(`/${homeWorkspace.id}/chat`)
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to Talkiary"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!(username && usernameAvailable)}
            showBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
              userId={profile?.user_id}
              onUsernameAvailableChange={setUsernameAvailable}
              onUsernameChange={setUsername}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        )

      // API Step
      case 2:
        return (
          <StepContainer
            stepDescription="Enter API keys for each service you'd like to use."
            stepNum={currentStep}
            stepTitle="Set API Keys (optional)"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <APIStep
              openaiAPIKey={openaiAPIKey}
              openaiOrgID={openaiOrgID}
              azureOpenaiAPIKey={azureOpenaiAPIKey}
              azureOpenaiEndpoint={azureOpenaiEndpoint}
              azureOpenai35TurboID={azureOpenai35TurboID}
              azureOpenai45TurboID={azureOpenai45TurboID}
              azureOpenai45VisionID={azureOpenai45VisionID}
              azureOpenaiEmbeddingsID={azureOpenaiEmbeddingsID}
              anthropicAPIKey={anthropicAPIKey}
              googleGeminiAPIKey={googleGeminiAPIKey}
              mistralAPIKey={mistralAPIKey}
              groqAPIKey={groqAPIKey}
              perplexityAPIKey={perplexityAPIKey}
              useAzureOpenai={useAzureOpenai}
              onOpenaiAPIKeyChange={setOpenaiAPIKey}
              onOpenaiOrgIDChange={setOpenaiOrgID}
              onAzureOpenaiAPIKeyChange={setAzureOpenaiAPIKey}
              onAzureOpenaiEndpointChange={setAzureOpenaiEndpoint}
              onAzureOpenai35TurboIDChange={setAzureOpenai35TurboID}
              onAzureOpenai45TurboIDChange={setAzureOpenai45TurboID}
              onAzureOpenai45VisionIDChange={setAzureOpenai45VisionID}
              onAzureOpenaiEmbeddingsIDChange={setAzureOpenaiEmbeddingsID}
              onAnthropicAPIKeyChange={setAnthropicAPIKey}
              onGoogleGeminiAPIKeyChange={setGoogleGeminiAPIKey}
              onMistralAPIKeyChange={setMistralAPIKey}
              onGroqAPIKeyChange={setGroqAPIKey}
              onPerplexityAPIKeyChange={setPerplexityAPIKey}
              onUseAzureOpenaiChange={setUseAzureOpenai}
              openrouterAPIKey={openrouterAPIKey}
              onOpenrouterAPIKeyChange={setOpenrouterAPIKey}
            />
          </StepContainer>
        )

      // Finish Step
      case 3:
        return (
          <StepContainer
            stepDescription="You are all set up!"
            stepNum={currentStep}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        )
      default:
        return null
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  )
}
