import OpenAI from 'openai';
import {OPENAI_API_KEY, OPENAI_ASSISTANT_KEY} from '$env/static/private';

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

async function polishReview(reviewText, threadId) {
    try {
        await openai.beta.threads.messages.create(threadId,
            {
                role: "user",
                content: `Polish the following review by making it positive, sanitizing it, while maintaining the tone of the original review, for Google Reviews:\n\n${reviewText}`,
            }
        );

        const run = await openai.beta.threads.runs.createAndPoll(threadId, {
            assistant_id: OPENAI_ASSISTANT_KEY
        });

        const messages = await openai.beta.threads.messages.list(threadId, {
            run_id: run.id,
        });

        const message = messages.data[messages.data.length - 1];
        return message.content[0].text.value;
    } catch (error) {
        console.error('Error during conversation:', error);
        throw error;
    }
}

export async function POST({request})
{
    let {reviewText, threadID} = await request.json();

    // Create a new thread for polishing if not already created
    if (!threadID) {
        try {
            let thread = await openai.beta.threads.create();
            threadID = thread.id;

            //console.log("Created thread is", threadId);
        } catch (error) {
            console.log("Error creating assistant", error);
            return new Response(JSON.stringify({error: "Failed to establish polishing service. Please try again later."}), {status: 500});
        }
    }

    // Polish the review
    try {
        //console.log("Using thread", threadID);

        const polishedReview = await polishReview(reviewText, threadID);

        return new Response(JSON.stringify({polishedReview, threadID}), {status: 200});
    } catch (error) {
        console.log("Error polishing review:", error);
        return new Response(JSON.stringify({error: "Failed to polish review. Please try again later."}), {status: 500});
    }
}
