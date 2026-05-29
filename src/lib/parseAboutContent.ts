export const parseAboutContent = (html: string = "") => {
    if (!html) {
      return {
        intro: "",
        mission: "",
        vision: "",
        purpose: "",
      };
    }
  
    const clean = html;
  
    // Detect if sections exist
    const hasMission = /Mission/i.test(clean);
    const hasVision = /Vision/i.test(clean);
    const hasPurpose = /Purpose/i.test(clean);
  
    // If NO sections exist → treat everything as intro
    if (!hasMission && !hasVision && !hasPurpose) {
      return {
        intro: clean,
        mission: "",
        vision: "",
        purpose: "",
      };
    }
  
    // Normalize headings safely
    const normalized = clean
      .replace(/<h[1-6][^>]*>.*?Mission.*?<\/h[1-6]>/i, "##MISSION##")
      .replace(/<h[1-6][^>]*>.*?Vision.*?<\/h[1-6]>/i, "##VISION##")
      .replace(/<h[1-6][^>]*>.*?Purpose.*?<\/h[1-6]>/i, "##PURPOSE##");
  
    let intro = "";
    let mission = "";
    let vision = "";
    let purpose = "";
  
    // Split safely step-by-step
    if (normalized.includes("##MISSION##")) {
      const parts = normalized.split("##MISSION##");
      intro = parts[0];
  
      let rest = parts[1];
  
      if (rest.includes("##VISION##")) {
        const mParts = rest.split("##VISION##");
        mission = mParts[0];
        rest = mParts[1];
  
        if (rest.includes("##PURPOSE##")) {
          const vParts = rest.split("##PURPOSE##");
          vision = vParts[0];
          purpose = vParts[1];
        } else {
          vision = rest;
        }
      } else if (rest.includes("##PURPOSE##")) {
        const mParts = rest.split("##PURPOSE##");
        mission = mParts[0];
        purpose = mParts[1];
      } else {
        mission = rest;
      }
    } else {
      // If Mission not found but others exist
      intro = normalized;
    }
  
    return {
      intro,
      mission,
      vision,
      purpose,
    };
  };
