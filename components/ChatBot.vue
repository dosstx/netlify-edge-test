<template>
    <header class="fixed z-10 top-0 w-full bg-blue-500 p-4 text-white bg-opacity-95">Chatbot</header>
    <div ref="chatContainer" class="overflow-y-auto px-4 pb-24 pt-20">
        <article :class="['chat', message.role === 'user' ? 'chat-start' : 'chat-end']" v-for="(message, index) in messages"
            :key="index">
            <!-- <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    <NuxtImg provider="imagekit" :src="message.role === 'user' ? 'avatar.jpg' : 'bot.jpg'" width="40"
                        height="40" />
                </div>
            </div> -->
            <div class="chat-header">
                {{ message.role === "user" ? "You" : "assistant" }}
            </div>
            <div class="chat-bubble">{{ message.content }}</div>
        </article>
        <aside v-if="answer" class="chat chat-end">
            <!-- <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    <NuxtImg provider="imagekit" src="bot.jpg" width="40" height="40" />
                </div>
            </div> -->
            <div class="chat-header">
                {{ answer.role }}
            </div>
            <div class="chat-bubble prose">
                {{ answer.content }}
            </div>
        </aside>
    </div>
    <footer class="fixed bottom-0 w-full bg-white p-4 shadow-md">
        <!-- <span v-if="answer">Assistant is typing...</span> -->
        <progress v-if="loading" class="progress progress-primary w-56"></progress>
        <form @submit.prevent="askQuestion">
            <div class="flex">
                <input required type="text" v-model="question"
                    class="mr-4 flex-grow rounded-md border-2 border-gray-300 p-2" placeholder="Type a message..." />
                <button type="submit" class="rounded-md bg-blue-500 p-2 text-white">Send</button>
                <label for="ask-input" class="sr-only">Ask a question</label>
            </div>
        </form>
    </footer>
</template>
  
<script setup>
const messages = ref([]);
const answer = ref(null);
const question = ref("");
const chatContainer = ref(null);
const loading = ref(false)


const lastChatBubbleElement = ref(null);

const askQuestion = async () => {
    try {
        messages.value.push({ role: "user", content: question.value });
        question.value = "";
        loading.value = true;
        const stream = await getAnswer({ messages: messages.value });
        answer.value = { role: "assistant", content: "" };

        useChatStream({
            stream,
            onChunk: ({ data }) => { answer.value.content += data; },
            onReady: () => {
                messages.value.push(answer.value);
                answer.value = null;
                loading.value = false;
                nextTick(() => {
                    // Directly use the ref here.
                    lastChatBubbleElement.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });
            },
        });
    } catch (error) {
        console.error('Error asking question', error)
    }

};

// Always scroll the last message into view
watch(messages, (newMessages) => {
    if (newMessages.length > 0) {
        nextTick(() => {
            // Update the ref to point to the new last chat bubble element.
            lastChatBubbleElement.value = chatContainer.value.getElementsByClassName('chat-bubble')[newMessages.length - 1];
            lastChatBubbleElement.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }
},
    {
        deep: true,
        flush: 'post',
    });


</script>