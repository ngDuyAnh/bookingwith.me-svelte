import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_ASSISTANT_KEY } from '$env/static/private';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});

async function polishReview(reviewText)
{
    try {
        await openai.beta.threads.messages.create(thread.id,
            {
                role: "user",
                content: `Polish the following review by making it positive, sanitizing it, while maintaining the tone of the original review, for Google Reviews:\n\n${reviewText}`,
            }
        );

        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: OPENAI_ASSISTANT_KEY
        });

        const messages = await openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
        });

        const message = messages.data[messages.data.length - 1];
        return message.content[0].text.value;
    } catch (error) {
        console.error('Error during conversation:', error);
        throw error;
    }
}

async function cleanupThread(bookingID) {
    const thread = customerThreads.get(customerId);
    if (thread) {
        try {
            await openai.beta.threads.delete(thread.id);
            customerThreads.delete(customerId);
        } catch (error) {
            console.error('Error during thread cleanup:', error);
            throw error;
        }
    }
}

export const actions = {
    polishReview: async ({ request }) => {
        const { customerId, reviewText } = await request.json();
        try {
            const polishedReview = await polishReview(customerId, reviewText);
            return new Response(JSON.stringify({ polishedReview }), { status: 200 });
        } catch (error) {
            console.log("Error polishing review:", error);
            return new Response(JSON.stringify({ error: "Failed to polish review. Please try again later." }), { status: 500 });
        }
    },
    cleanupThread: async ({ request }) => {
        const { customerId } = await request.json();
        try {
            await cleanupThread(customerId);
            return new Response(JSON.stringify({ message: "Thread cleaned up successfully." }), { status: 200 });
        } catch (error) {
            console.log("Error during thread cleanup:", error);
            return new Response(JSON.stringify({ error: "Failed to cleanup thread. Please try again later." }), { status: 500 });
        }
    }
};
