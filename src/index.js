document.addEventListener('DOMContentLoaded', () => {
  fetchImageData()
  handleLikes()
  handleNewComments()
})

function fetchImageData() {
  fetch(`https://randopic.herokuapp.com/images/2250`)
  .then(res => res.json())
  .then(data => renderImageData(data))
}

function handleLikes() {
  const likeButton = document.getElementById('like_button')
  likeButton.addEventListener('click', addLike)
}

function handleNewComments() {
  const commentForm = document.getElementById('comment_form')
  commentForm.addEventListener('submit', renderNewComment)
}

function renderImageData(data) {

  const image = document.querySelector('img')
  image.src = data["url"]
  image.dataset.id = data["id"]

  document.getElementById('name').textContent = data["name"]

  document.getElementById('likes').textContent = data["like_count"]

  document.getElementById('comments').innerHTML = ''
  data["comments"].map(comment => renderComment(comment["content"], comment["id"]))

}

function renderComment(commentContent, commentId) {
  const li = document.createElement('li')
  li.textContent = commentContent

  const del = document.createElement('button')
  del.textContent = 'Delete Comment'
  del.dataset.id = commentId
  del.addEventListener('click', deleteComment)

  li.appendChild(del)
  document.getElementById('comments').appendChild(li)
}

function addLike() {
  const likes = document.getElementById('likes')
  likes.textContent = parseInt(likes.textContent) + 1
  fetchLikes()
}

function fetchLikes() {
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
  postComment(e.target.elements["comment_input"].value)
  e.target.reset()
}

function postComment(commentContent) {
  fetch(`https://randopic.herokuapp.com/comments/`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'      
    },
    method: 'POST',
    body: JSON.stringify({image_id: 2250, content: commentContent})
  })
  .then(res => res.json())
  .then(data => renderComment(data["content"], data["id"]))
}

function deleteComment(e) {
  e.target.parentNode.remove()
  fetch(`https://randopic.herokuapp.com/comments/${e.target.dataset.id}`, {
    method: 'DELETE'
  })
}
