import { SetStateAction, useContext } from "react";
import { AccountContext } from "@/contexts/AccountContext";
import { DeploymentConfiguration } from "@/types/dataProvider"


export function useDraft(): [ DeploymentConfiguration | null, (draft: DeploymentConfiguration | null) => void ] {
  const { draft, setDraft } = useContext(AccountContext);

  const setDraftDeploy = (draft: DeploymentConfiguration | null) => {
    if (draft) {
      setDraft(draft)
      localStorage.setItem('draft', JSON.stringify(draft))
    }
  }

  if (!draft) {
    return [ draft, setDraftDeploy ]
  } else {
    // Check local storage.
    try {
      const draftString = localStorage.getItem('draft')
      const draftData = JSON.parse(draftString) as DeploymentConfiguration

      if (draftData) {
        setDraft(draft)
        return [ draftData, setDraftDeploy ]
      } else {
        // Not sure if this ever runs?
        console.error("Possible error?")
      }
    } catch(err) {
      console.error("Couldn't find draft: ", err)
    }
  }

  return [ null, setDraftDeploy ]
}
