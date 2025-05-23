"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const recruitmentTextBase = `
                                                                                          
                                             ,,,,,,,,                                     
                                       ,:+?%S#@@@@@@##S%*;:                               
                                    ,+%#@@@@@#SSSSSS#@@@@@@S?;,                           
                                  ,?#@@@#?+:,       ,,:;*%#@@@#*:                         
                                ,*@@@@?:                  ,;?#@@@?,                       
                               :S@@@%:                       ,*@@@#;                      
                              :#@@#+                           :S@@@+                     
                             :#@@#:                             ,%@@@+                    
                            ,S@@@;           :+?SS##S?+:         ,@@@#,                   
                            +@@@%         ,+S@@@@@@@@@@@S%?+      %@@@+                   
                            S@@@;        +#@@@#?+:,,:S@@@@@%      +@@@*                   
                           :@@@S       :%@@@S;,      ?@@@@%,      *@@@*                   
                           +@@@*      ;#@@@*        ,#@@@%,       %@@@:                   
                           S@@@:     +@@@S:         ?@@@%,       +@@@?                    
                          :@@@%     ;@@@S,        ,?@@@%        +@@@S,                    
                          ?@@@;    ,#@@#,        ;S@@@#,      :%@@@S,                     
                         ;@@@%     *@@@S      :*S@@@@@%     :%@@@@*,                      
                        :#@@@:     *@@@@%+;*?#@@@S*@@@@%??%#@@@@%:                        
                  :*?**%@@@@+      ,S@@@@@@@@@@S+, S@@@@@@@@@#?:                          
            ,;+?%*;@@@@@@@S+        ,*%####S%+:    ,+S#@@#S*;,                            
          ;%#@@@@@@@@@@*;;,             ,,,           ,,,,                                
        ;S@@@@@@@@@?;%?                                                                   
      ,%@@@@%@@@@@S,,                                                                     
     :S@@@@+S@@S@@+                                                                       
     %@@@@**@##?@@:                                                                       
     ;S@@%:@@*S?@#,                                                                       
       :;,%@%+??@S                                                                        
          %@;%*?@%                                                                        
           ;,;::*:                                                                        
                                                                                          
`;

const finnishRecruitmentText = `${recruitmentTextBase}
Hae digitoimikuntaan https://tietokilta.fi/fi/kilta/toimikunnat#digitoimikunta
`;

const englishRecruitmentText = `${recruitmentTextBase}
Apply to the digital services committee at https://tietokilta.fi/en/guild/committees#digitalization-committee
`;

const isProd = process.env.NODE_ENV === "production";

export function DigiCommitteeRecruitmentAlert() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isFinnish = locale === "fi";

  useEffect(() => {
    if (isProd) {
      const recruitmentText = isFinnish
        ? finnishRecruitmentText
        : englishRecruitmentText;
      // eslint-disable-next-line no-console -- use console for recruiting new members
      console.log(
        `%c${recruitmentText}`,
        "font-family: ui-monospace, monospace; color: #3185c5;",
      );
    }
  }, [pathname, isFinnish]);

  return null;
}
