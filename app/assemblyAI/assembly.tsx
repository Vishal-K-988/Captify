import { AssemblyAI } from "assemblyai";

const apiKey = process.env.Assembly_AI; 
if(!apiKey) {
    throw new Error ("Missing ASSEMBLY_AI is missing ") ;
}

// client 
const client = new AssemblyAI({
    apiKey 
})