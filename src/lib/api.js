const LOCALHOST_DOMAIN = "http://localhost:8080";
// const LOCALHOST_DOMAIN = "https://mern-backend-cpbj.onrender.com";

export async function signup(userData) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/auth/signup`, {
    method: "POST",
    body: userData,
  });
  const data = await response.json();

  if (response === 422) {
    throw new Error(
      data.message ||
        "Validation failed. Make sure the email address isn't used yet!"
    );
  }
  if (!response.ok) {
    throw new Error(data.message || "Could not create user.");
  }
  return data;
}

export async function login(requestData) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: requestData.email,
      password: requestData.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not authenticate you!");
  }

  const data = await response.json();

  const expirationTime = new Date(new Date().getTime() + 3600000 * 2);
  requestData.method(data.token, data.userId, expirationTime.toISOString());
  return data;
}

export async function addBlog(requestData) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/feed/blog`, {
    method: "POST",
    body: requestData.data,
    headers: {
      Authorization: "Bearer " + requestData.token,
    },
  });
  if (!response.ok) {
    throw new Error("Could not add post.");
  }
}

export async function getSingleBlog(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/feed/blog/${requestData.blogId}`,
    {
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch post.");
  }

  const loadedPost = {
    id: data.blog._id,
    fullname: data.blog.creator.firstname + " " + data.blog.creator.lastname,
    profilePictureUrl: data.blog.creator.profilePictureUrl,
    ...data.blog,
  };

  return loadedPost;
}

export async function deleteBlog(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/feed/blog/delete/${requestData.blogId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not delete blog.");
  }
}

export async function draftBlog(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/feed/blog/draft/${requestData.blogId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not delete blog.");
  }
}

export async function editBlog(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/feed/blog/${requestData.blogId}`,
    {
      method: "PUT",
      body: requestData.data,
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create quote.");
  }

  return null;
}

export async function getProfile(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/user/profile/${requestData.profileId}`,
    {
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not get posts.");
  }
  return data;
}

export async function editProfile(requestData) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/user/profile/update`, {
    method: "PUT",
    body: requestData.data,
    headers: {
      Authorization: "Bearer " + requestData.token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create quote.");
  }

  return data;
}

export async function getProfilePosts(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/user/blogs/${requestData.profileId}`,
    {
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not get posts.");
  }

  const profilePosts = [];

  for (const key in data.blogs) {
    const blogObj = {
      id: key,
      fullname: `${data.blogs[key].creator.firstname} ${data.blogs[key].creator.lastname}`,
      ...data.blogs[key],
    };
    profilePosts.push(blogObj);
  }
  return profilePosts;
}

export async function getProfileDrafts(requestData) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/user/blogs/drafts`, {
    headers: {
      Authorization: "Bearer " + requestData.token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not get drafts.");
  }

  const profileDrafts = [];

  for (const key in data.blogs) {
    const blogObj = {
      id: key,
      fullname: `${data.blogs[key].creator.firstname} ${data.blogs[key].creator.lastname}`,
      ...data.blogs[key],
    };
    profileDrafts.push(blogObj);
  }
  return profileDrafts;
}

// //ALL POSTS IN FEED
export async function getAllBlogs(token) {
  const response = await fetch(`${LOCALHOST_DOMAIN}/feed/blogs`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch posts.");
  }
  const data = await response.json();
  const loadeadBlogs = [];

  for (const key in data.blogs) {
    const blogObj = {
      id: key,
      fullname: `${data.blogs[key].creator.firstname} ${data.blogs[key].creator.lastname}`,
      ...data.blogs[key],
    };
    loadeadBlogs.push(blogObj);
  }
  return loadeadBlogs;
}

export async function searchBlog(requestData) {
  const response = await fetch(
    `${LOCALHOST_DOMAIN}/feed/blog/search/${requestData.title}`,
    {
      headers: {
        Authorization: "Bearer " + requestData.token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Could not fetch posts.");
  }
  const data = await response.json();
  const loadeadBlogs = [];

  for (const key in data.blogs) {
    const blogObj = {
      id: key,
      fullname: `${data.blogs[key].creator.firstname} ${data.blogs[key].creator.lastname}`,
      ...data.blogs[key],
    };
    loadeadBlogs.push(blogObj);
  }
  console.log(loadeadBlogs);
  return loadeadBlogs;
}
