function sendMsg(){
    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    if(text==="") return;
  
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "msg right";
    div.innerHTML = "<b>Você:</b> " + text;
    messages.appendChild(div);
  
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
  
  