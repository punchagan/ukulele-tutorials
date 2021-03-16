export const postData = (videoId, data) => {
  fetch(`/api/video/${videoId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => console.log(data));
};

export const markIgnored = videoId => postData(videoId, { ignore: 1 });
