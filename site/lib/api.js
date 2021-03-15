export const markIgnored = videoId => {
  fetch(`/api/video/${videoId}`, {
    method: "PUT",
    body: JSON.stringify({ ignore: 1 }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => console.log(data));
};
