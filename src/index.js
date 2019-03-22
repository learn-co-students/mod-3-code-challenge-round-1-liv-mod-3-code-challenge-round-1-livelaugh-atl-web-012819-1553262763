
//GLOBAL CONSTANTS
const imageId = 2249 //Enter the id from the fetched image here

const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

const likeURL = `https://randopic.herokuapp.com/likes`

const commentsURL = `https://randopic.herokuapp.com/comments/`

//PAGE LOAD KICKS OFF RENDERING
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  getImage(imageURL,renderImage)
  card = queryCard()
  card.button.addEventListener("click", handleLike)
  card.form.addEventListener("submit", handleComment)
})

//FETCH HELPERS
function getImage(url,callback) {
  fetch(url)
  .then((resp)=>{
    if(resp.ok){
      return resp.json()
    }
  })
  .then(data => callback(data))
}

function postImage(url,body,callback) {
  fetch(url,{
    method: "POST",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"},
    body: JSON.stringify(body)
  }).then((resp)=>callback(resp))
}

function deleteReq(url,callback){
  fetch(url,{
    method: "DELETE",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"},
  }).then(resp => callback(resp))
}

//DOM RENDERING
function renderImage(imageData) {
  card = queryCard()
  card.image.src = imageData.url
  card.h4.innerHTML = imageData.name
  card.likes.innerHTML = imageData.like_count

  imageData.comments.forEach(comment=>{
    li = newComment(comment.content)
    li.dataset.id = comment.id
    card.ul.appendChild(li)
  })
}

function newComment(commentString){
  const li = document.createElement("li")
  const deleteBtn = document.createElement("button")

  deleteBtn.addEventListener("click",handleDeleteComment)
  deleteBtn.innerText = "Delete"

  li.innerHTML = commentString
  li.appendChild(deleteBtn)

  return li
}

//EVENT HANLDERS
function handleComment(event) {
  event.preventDefault()
  
  const commentString = event.target.comment.value
  const li = newComment(commentString)
  const {ul} = queryCard()

  const requestBody = {"image_id": imageId,
                        "content": commentString }
  postImage(commentsURL,requestBody,(resp)=>console.log(resp))

  ul.appendChild(li)
  event.target.reset()
}

function handleDeleteComment(event) {
  const commentLI = event.target.parentNode
  const commentID = commentLI.dataset.id

  deleteReq(`${commentsURL}${commentID}`,(resp)=>{
    commentLI.remove()
    console.log("Bye bye comment...")
  })
}

function handleLike(event) {
  let {likes} = queryCard()
  likes.innerHTML++
  //Dont mess this up, cause it seems 
  //there is no way to delete likes
  requestBody = {"image_id": imageId}
  postImage(likeURL,requestBody,(resp)=>console.log("success"))
}

//DOM HELPER
function queryCard() {
  return {
    card : document.getElementById("image_card"),
    image: document.getElementById("image"),
    h4: document.getElementById("name"),
    likes: document.getElementById("likes"),
    button: document.getElementById("like_button"),
    form: document.getElementById("comment_form"),
    ul: document.getElementById("comments")
  }
}