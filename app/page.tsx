"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";


const client = generateClient<Schema>();

export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>MxSense Technologies</h1>
      <p>Enterprise AI for Quality, Traceability, and Decision Intelligence.</p>
    </main>
  );
}