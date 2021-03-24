export const getVideoMetadata = ({ id, channel }) => {
  return fetch(`/api/video/get-metadata?id=${id}&channel=${channel}`).then(response =>
    response.json()
  );
};

export const postData = (videoId, data) => {
  return fetch(`/api/video/${videoId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  });
};

export const markIgnored = videoId => postData(videoId, { ignore: 1 });

export const ytSearchDescription = q => {
  return fetch(`/api/yt-search?q=${q}`).then(response => response.json());
};
