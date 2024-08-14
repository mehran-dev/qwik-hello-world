import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  server$,
} from "@builder.io/qwik-city";

export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log("VOTE", props);
});

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
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);

  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    console.log("FAVORITE (isomorphic)", isFavoriteSignal.value);
    server$(() => {
      console.log("FAVORITE (server)", isFavoriteSignal.value);
    })();
  });

  return (
    <section class="section bright">
      <div>A Joke!</div>

      <div>{dadJoke.value.joke}</div>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJoke.value.id} />
        <button name="vote" value="up">
          👍
        </button>
        <button name="vote" value="down">
          👎
        </button>
      </Form>

      <button
        onClick$={() => {
          isFavoriteSignal.value = !isFavoriteSignal.value;
          console.log(isFavoriteSignal.value);
        }}
      >
        {!isFavoriteSignal.value ? "Like " : "Dislike"}
      </button>
    </section>
  );
});
