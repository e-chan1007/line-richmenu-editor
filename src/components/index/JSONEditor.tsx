// etc
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import Ajv from "ajv";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import { JSONEditorContext } from "contexts/JSONEditorContext";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { ThemeColorContext } from "pages/_app";
import richMenuSchema from "../../../public/schemas/richmenu.json";
import React, { useContext, useEffect, useRef, useState } from "react";
import loader from "@monaco-editor/loader";

export default function JSONEditor() {
  const { editorMode, systemMode } = useContext(ThemeColorContext);
  const { setters } = useContext(EditingRichMenuContext);
  const { jsonEditorValue, setJSONEditorValue } = useContext(JSONEditorContext);
  const monacoRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>(null);
  const [isJSONValid, setIsJSONValid] = useState(true);
  const [isMonacoLoading, setIsMonacoLoading] = useState(true);

  const editorElementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!editorElementRef.current) return;
    let windowResizeListener;
    let monacoCreateListener;
    let monacoChangeModelListener;
    loader.config({ "vs/nls": { availableLanguages: { "*": "ja" }}});
    loader.init().then(monaco => {
      try {
        if (isMonacoLoading) {
          monacoCreateListener = monaco.editor.onDidCreateEditor((editor: monacoEditor.editor.IStandaloneCodeEditor) => {
            monacoRef.current = editor;
            windowResizeListener = () => editor.layout();
            window.addEventListener("resize", windowResizeListener);
            setIsMonacoLoading(false);
            monacoRef.current.setValue(jsonEditorValue);
            monacoChangeModelListener = editor.onDidChangeModelContent(() => setJSONEditorValue(monacoRef.current.getValue()));
          });
          monaco.editor.create(editorElementRef.current, {
            automaticLayout: true,
            formatOnType: true,
            formatOnPaste: true,
            value: jsonEditorValue,
            language: "json",
            theme: { light: "vs", dark: "vs-dark" }[editorMode === "system" ? systemMode : editorMode],
            contextmenu: true
          });

          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemaValidation: "error",
            validate: true,
            schemas: [{
              uri: "https://richmenu.app.e-chan.me/schemas/richmenu.json",
              fileMatch: ["*"],
              schema: richMenuSchema
            }]
          });
        }
      } catch (_) {
        console.error(_);
      }
    });
    return function cleanup() {
      window.removeEventListener("resize", windowResizeListener);
      monacoCreateListener?.dispose?.();
      monacoChangeModelListener?.dispose();
      monacoRef.current?.getModel?.()?.dispose?.();
      monacoRef.current?.dispose?.();
      monacoRef.current = null;
    };
  }, [editorElementRef]);

  useEffect(() => {
    // if (monacoRef.current) monacoRef.current.setValue(jsonEditorValue);
    let jsonEditorValueAsObject;
    try {
      jsonEditorValueAsObject = JSON.parse(jsonEditorValue);
    } catch (_) {
      setIsJSONValid(false);
      return;
    }
    const isJSONValid = new Ajv().compile(richMenuSchema)(jsonEditorValueAsObject);
    setIsJSONValid(isJSONValid);

    if (isJSONValid) {
      Object.entries(jsonEditorValueAsObject).forEach(([key, value]) => {
        setters[`set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`](value);
      });
    }
  }, [jsonEditorValue]);

  useEffect(() => {
    if (monacoRef.current) monacoRef.current.updateOptions({ theme: { light: "vs", dark: "vs-dark" }[editorMode === "system" ? systemMode : editorMode] });
  }, [editorMode, systemMode]);

  const pasteText = async () => {
    const selection = monacoRef.current.getSelection();
    const text = await navigator.clipboard.readText();
    monacoRef.current.executeEdits("my-source", [{ range: selection, text: text, forceMoveMarkers: true }]);
    monacoRef.current.trigger("anyString", "editor.action.formatDocument", null);
  };

  const copyText = async (cut = false) => {
    const selection = monacoRef.current.getSelection();
    const text = monacoRef.current.getModel().getValueInRange(selection);
    await navigator.clipboard.writeText(text);
    if (cut) monacoRef.current.executeEdits("my-source", [{ range: selection, text: "", forceMoveMarkers: true }]);
    monacoRef.current.trigger("anyString", "editor.action.formatDocument", null);
  };

  return (
    <div style={{ height: "100%" }}>
      <Stack direction="column" sx={{ height: "100%" }} >
        {isMonacoLoading && <LinearProgress/>}
        <Box sx={{ flex: 1 }} data-target="test">
          {/* <MonacoEditor
            editorDidMount={editorDidMount}
            editorWillMount={editorWillMount}
            width="100%"
            language="json"
            theme={(editorMode === "system" ? systemMode : editorMode) === "dark" ? "vs-dark" : "vs"}
            value={jsonEditorValue}
            onChange={value => setJSONEditorValue(value)}
            options={{
              contextmenu: false,
              formatOnPaste: true
            }}
          /> */}
          <div ref={editorElementRef} style={{ height: "100%" }} />
        </Box>
        {isMonacoLoading && (
          <Alert severity="info">JSONエディタを読み込んでいます...</Alert>
        )}
        { !isMonacoLoading && (isJSONValid ? (
          <Alert severity="success">正しい形式のJSONファイルです。</Alert>
        ) : (
          <Alert severity="error">不正な形式のJSONファイルです。内容を確認してください。</Alert>
        ))}
      </Stack>
    </div>
  );
}
