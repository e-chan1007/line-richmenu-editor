import React, { useEffect, useRef } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import JSONEditor from "../JSONEditor";

export default function JSONEditorCard() {
  return (<>
    <Card sx={{ overflow: "visible" }}>
      <CardContent sx={{ height: "75vh" }}>
        <JSONEditor />
      </CardContent>
    </Card>
  </>
  );
}
