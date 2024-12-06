const URL = 'https://67506e6569dc1669ec1b22e8.mockapi.io/api/v1/posts';

async function getPosts() {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '<p>Loading Posts...</p>';

    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p>Unable to load Posts. Try again later.</p>';
        showNotification('Failed to load posts. Please try again.', 'error');
    }
}

async function createPost(postData) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const createdPost = await response.json();
        addPostToList(createdPost);
        showNotification('Post created successfully!', 'success');
        return createdPost;
    } catch (error) {
        console.error('Error creating post:', error);
        showNotification('Failed to create post. Please try again.', 'error');
    }
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    postElement.innerHTML = `
        <div class="post-content">
            <span class="category">${post.category || 'No category'}</span>
            <h3 class="post-title">${post.title || 'No title'}</h3>
            <p>${post.description || 'No description available.'}</p>
        </div>
    `;

    return postElement;
}

function addPostToList(post) {
    const postsContainer = document.querySelector('.posts-container');
    const postElement = createPostElement(post);
    postsContainer.append(postElement);
}

function renderPosts(posts) {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', getPosts);

document.getElementById('postForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const category = document.getElementById('categoryInput').value;
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;

    const postData = {
        category: category,
        title: title,
        description: description,
    };

    const createdPost = await createPost(postData);

    if (createdPost) {
        document.getElementById('postForm').reset();
    }
});
