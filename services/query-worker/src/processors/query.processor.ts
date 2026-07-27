import { answerQuestion } from "../services/query.service.js";

export async function processQueryJob(job:any) {
    const { question } = job.data;

    return await answerQuestion(question);
}