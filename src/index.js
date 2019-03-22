document.addEventListener('DOMContentLoaded', () => {

  let imageId = 2250

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch(imageURL)
  .then(res => res.json())
  .then(data => renderImageData(data))

  document.getElementById('like_button').addEventListener('click', addLike)

  document.getElementById('comment_form').addEventListener('submit', renderNewComment)

})

function renderImageData(data) {
  const imageSource = data["url"]
  const imageName = data["name"]
  const imageLikes = data["like_count"]
  const imageComments = data["comments"]

  const image = document.querySelector('img')
  image.src = imageSource
  image.dataset.id = data["id"]

  document.getElementById('name').textContent = imageName

  document.getElementById('likes').textContent = imageLikes

  document.getElementById('comments').innerHTML = ''
  imageComments.map(comment => renderComment(comment["content"], comment["id"]))
}

function renderComment(commentContent, commentId) {
  const commentsContainer = document.getElementById('comments')
  const li = document.createElement('li')
  li.textContent = commentContent
  const del = document.createElement('button')
  del.textContent = 'Delete Comment'
  del.dataset.id = commentId
  del.addEventListener('click', deleteComment)
  li.appendChild(del)
  commentsContainer.appendChild(li)
}

function addLike(e) {
  const likes = document.getElementById('likes')
  likes.textContent = parseInt(likes.textContent) + 1

  fetch(`https://randopic.herokuapp.com/likes/`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({image_id: 2250})
  })
}

function renderNewComment(e) {
  e.preventDefault()
  const commentContent = e.target.elements["comment_input"].value
  postComment(commentContent)
  e.target.reset()
}

function postComment(commentContent) {
  const postBody = {image_id: 2250, content: commentContent}
  fetch(`https://randopic.herokuapp.com/comments/`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'      
    },
    method: 'POST',
    body: JSON.stringify(postBody)
  })
  .then(res => res.json())
  .then(data => renderComment(data["content"], data["id"]))
}

function deleteComment(e) {
  e.target.parentNode.remove()
  const commentId = e.target.dataset.id
  fetch(`https://randopic.herokuapp.com/comments/${commentId}`, {
    method: 'DELETE'
  })
}
