import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { APIResponse, APISpecification } from "constants/RichMenuAPI";
import { APIControllerContext } from "contexts/APIControllerContext";
import { BotAccountContext } from "contexts/BotAccountContext";
import { ThemeColorContext } from "pages/_app";
import Prism from "prismjs";
import "prismjs/plugins/custom-class/prism-custom-class.min.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import prismVSStyles from "styles/prism-vs.module.scss";
import prismVSDarkStyles from "styles/prism-vsc-dark-plus.module.scss";

export default function APIController(
  { children, apiSpec, ...params }: { children?: React.ReactNode, apiSpec: APISpecification, [key: string]: unknown }
) {
  const controllerContext = useContext(APIControllerContext);
  const { editorMode, systemMode } = useContext(ThemeColorContext);
  const { accounts, editingBotId } = useContext(BotAccountContext);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [results, setResults] = useState<APIResponse[]>(controllerContext.dataStore[apiSpec.key]?.results || []);
  const [editableValues, setEditableValues] = useState<{ [key: string]: unknown }>(controllerContext.dataStore[apiSpec.key]?.params || {});

  const paramsValidateResult = useMemo(() => apiSpec.validateParams({ ...params, ...editableValues }), [params, editableValues]);

  const prismTheme = useMemo(() => {
    const theme = ({ light: prismVSStyles, dark: prismVSDarkStyles }[editorMode === "system" ? systemMode : editorMode]);
    Prism.plugins.customClass.map(theme);
    return theme;
  }, [editorMode, systemMode]);
  const prismHTML = useMemo(() => results.length ? Prism.highlight(results.map(result =>
    `// ${result.label}の応答: ${result.status}(${(result.status >= 200 && result.status < 300) ? "成功" : "エラー"})\n// ${result.endpoint}\n${result.result}`
  ).join("\n\n"), Prism.languages.javascript, "javascript") : "", [results, prismTheme]);
  const handleChange = (panel: string) => (_: unknown, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (controllerContext.dataStore[apiSpec.key]) {
      setResults(controllerContext.dataStore[apiSpec.key].results);
      setEditableValues(controllerContext.dataStore[apiSpec.key].params);
    }
  }, [controllerContext.dataStore[apiSpec.key]]);

  useEffect(() => {
    controllerContext.setStoreValue(apiSpec.key, { results, params: editableValues });
  }, [results, editableValues]);

  useEffect(() => {
    controllerContext.setIsAPICalling(isAPICalling);
  }, [isAPICalling]);

  return (
    <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          {apiSpec.label}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>{apiSpec.description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {
          (() => {
            const endpoints = typeof apiSpec.endpoints === "function" ? apiSpec.endpoints({ ...params, ...editableValues }) : apiSpec.endpoints;
            if (endpoints.length > 0) {
              return (<>
                <Typography sx={{ mb: 1 }}>実行するAPI:</Typography>
                <ul style={{ marginTop: 0 }}>
                  {endpoints.map((endpoint, i) => (
                    <li key={i}>
                      {endpoint.replace(/(\{(.+?)\})/g, (_, p1, p2) => {
                        if ({ ...params, ...editableValues }[p2]) return { ...params, ...editableValues }[p2];
                        return p1;
                      })}
                    </li>
                  ))}
                </ul></>
              );
            }
          })()}
        <div>
          {children}
        </div>
        {!paramsValidateResult.isSucceeded && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>エラー</AlertTitle>
            <ul>
              {paramsValidateResult.messages.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          </Alert>
        )}
        <LoadingButton
          onClick={() => {
            setIsAPICalling(true);
            apiSpec.callAPI(
              accounts.find(({ basicId }) => basicId === editingBotId)?.channelAccessToken,
              { ...params, ...editableValues }
            ).then(result => setResults(result)).finally(() => setIsAPICalling(false));
          }}
          sx={{ my: 1 }}
          disabled={!paramsValidateResult.isSucceeded || controllerContext.isAPICalling}
          loading={isAPICalling}
        >
          実行する
        </LoadingButton>
        {results.length > 0 && (
          <div className={prismTheme.prism}>
            <pre><code className="language-json" dangerouslySetInnerHTML={{ __html: prismHTML }}></code></pre>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
