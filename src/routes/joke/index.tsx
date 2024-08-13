import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });

  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export default component$(() => {
  const dadJoke = useDadJoke();

  return (
    <section class="section bright">
      <div>A Joke!</div>

      <div>{dadJoke.value.joke}</div>
    </section>
  );
});
