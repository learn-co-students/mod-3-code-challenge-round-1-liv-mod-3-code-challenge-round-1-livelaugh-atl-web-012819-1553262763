  document.addEventListener('DOMContentLoaded', function() {

    let imageId = 2248
    
    const imageURL = `https://randopic.herokuapp.com/images/2248`
  
    const likeURL = `https://randopic.herokuapp.com/likes/`
  
    const commentsURL = `https://randopic.herokuapp.com/comments/`

    const imgCard = document.querySelector("#image_card")

    const img = document.querySelector("#image")
    imgCard.append(img)

    const name = document.querySelector("#name")
    imgCard.appendChild(name)

    const span = document.querySelector("span")
    imgCard.appendChild(span)

    const likes = document.querySelector("span span")
    imgCard.appendChild(likes)

    const likeBtn = document.querySelector("#like_button")
    imgCard.appendChild(likeBtn)

    const form = document.querySelector("#comment_form")
    imgCard.appendChild(form)

    const commentsUl = document.querySelector("#comments")
    imgCard.appendChild(commentsUl)

  
    likeBtn.addEventListener("click", handleLike)
  
    form.addEventListener("submit", handleAddComment)
  
    getImage()
  
    function getImage() {
      fetch(imageURL)
        .then(res => res.json())
        .then(data => displayImageInfo(data))
    }
  
    function displayImageInfo(data) {
      img.src = data.url
      name.innerText = data.name
      likes.innerText = data.like_count
      data.comments.forEach(comment => {
        const commentLi = document.createElement('li')
        commentLi.innerText = comment.content
        commentsUl.append(commentLi)
      })
    }

    // function handleLike(event) {
    //   console.log(event)
  
    //   let newLike = event.target.querySelector('span').innerText
    //   let id = event.target.dataset.id
    //   console.log(newLike)
  
    //   let fetchBody = {
    //       headers: {
    //         "Content-Type": "application/json",
    //       Accept: "application/json"},
    //       method: 'POST',
    //       body: `{"likes": ${++newLike}}`
    //     }
    //     event.target.querySelector('span').innerHTML = newLike
      
    //     fetch(`https://randopic.herokuapp.com/likes/`, fetchBody)
      
    //    }
     function handleLike(event) {

      console.log(event)
      //  debugger;
      newLike = event.target.parentNode.children[3] 
      const addLike = newLike.querySelector("#likes")
       ++addLike.innerText
      //understand there is an issue because of null value, ahhhhhh
      //got it to add a like! but unsure which correction did that and ran out of time to recorrect
      
      fetch(`https://randopic.herokuapp.com/likes/`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({image_id:imageId})
      })
      
    }

    function handleAddComment (event) {
    event.preventDefault()
    const ul = event.target.parentNode.querySelector("#comments")
    let input = event.target[0].value
    const commentLi = document.createElement('li')
    commentLi.innerText = input
    ul.appendChild(commentLi)
    event.target.reset()

    fetch(commentsURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({image_id:imageId, content:input})
    })
    }

  
  }
  )
