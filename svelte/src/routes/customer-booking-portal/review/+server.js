import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});
let assistant = undefined;
let thread = undefined;
let createdAssistant = false;
let count = 0;

async function polishReview(reviewText) {
    console.log(reviewText ,"  ",count++);
    try {
        await openai.beta.threads.messages.create(thread.id,
            {
                role: "user",
                content: `Polish the following review for Google Reviews:\n\n${reviewText}`,
            }
        );

        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id
        });

        const messages = await openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
        });

        const message = messages.data[messages.data.length - 1];
        const polishedText = message.content[0].text.value;
        return polishedText;
    } catch (error) {
        console.error('Error during conversation:', error);
        throw error;
    }
}

async function createAssistant() {
    const assistant = await openai.beta.assistants.create({
        name: "Booking with Me",
        instructions:
            "You are a helpful assistant that polishes and enhances user-provided reviews for Google Reviews. Keep reviews concise but not too short.",
        model: "gpt-4-turbo",
    });

    return assistant;
}


export async function POST({ request }) {
    const { reviewText } = await request.json();
    if (!createdAssistant && assistant == undefined) {
        try {
            assistant = await createAssistant();
            thread = await openai.beta.threads.create();
            createdAssistant = true;
        } catch (error) {
            createdAssistant = false;
            assistant = undefined;
            console.log("Error creating assistant", error);
            return new Response(JSON.stringify({ error: "Failed to establish polishing service. Please try again later." }), { status: 500 });
        }
    }
    try {
        const polishedReview = await polishReview(reviewText);
        return new Response(JSON.stringify({ polishedReview }), { status: 200 });
    } catch (error) {
        console.log("Error polishing review:", error);
        return new Response(JSON.stringify({ error: "Failed to polish review. Please try again later." }), { status: 500 });
    }
}
