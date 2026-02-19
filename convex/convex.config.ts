import { defineApp } from "convex/server";
import convexImport from "@convex-dev/convex";
import modules from "./_generated/modules.js";

const convex = defineApp();
const imported = await convexImport(modules, convex);
export default imported;