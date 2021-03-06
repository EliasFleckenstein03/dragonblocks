/*
 * chat.js
 * 
 * Copyright 2020 Elias Fleckenstein <eliasfleckenstein@web.de>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */
dragonblocks.Chat = class{
	constructor(){
		this.input = [""];
		this.history = -1;
		this.lines = dragonblocks.settings.chat.lines;
		this.addGraphics();
		this.clear();
		dragonblocks.keyHandler.down("t", _ => {
			dragonblocks.chat.open();
		});
		dragonblocks.keyHandler.down("/", event => {
			dragonblocks.chat.open();
			document.getElementById("dragonblocks.chat.input").value = "/";
		});
	}
	addGraphics(){
		let display = document.createElement("div");
		display.id = "dragonblocks.chat";
		display.style.position = "fixed";
		display.style.top = "0px";
		display.style.left = "0px";
		display.style.backgroundColor = "black";
		display.style.opacity = "0.7";
		display.style.height = 23 * this.lines + "px";
		display.style.fontSize = "20px";
		display.style.color = "white";
		display.style.width = "100%";
		display.style.fontFamily = "monospace";
		display.style.overflowY = "scroll";
		display.style.scrollbarWidth = "none";
		display.style.visibility = "hidden";
		document.body.appendChild(display);
		let input = document.createElement("input");
		input.id = "dragonblocks.chat.input";
		input.style.position = "fixed";
		input.style.top = 23 * this.lines + "px";
		input.style.left = "0px";
		input.style.backgroundColor = "black";
		input.style.border = "none";
		input.style.opacity = "0.7";
		input.style.fontSize = "20px";
		input.style.color = "white";
		input.style.height = "23px";
		input.style.width = "100%";
		input.style.caretWidth = "30px";
		input.style.caretHeight = "20px";
		input.style.fontFamily = "monospace";
		input.style.visibility = "hidden";
		input.addEventListener("keydown", event => {
			switch(event.key){
				case "Enter":
					if(event.srcElement.value == "")
						return;
					dragonblocks.chat.input[dragonblocks.chat.input.length - 1] = event.srcElement.value;
					dragonblocks.chat.send(event.srcElement.value);
					event.srcElement.value = "";
					dragonblocks.chat.input.push("");
					dragonblocks.chat.history = -1;
					break;
				case "Escape":
					dragonblocks.chat.close();
					break;
				case "ArrowUp":
					event.srcElement.value = dragonblocks.chat.historyUp();
					break;
				case "ArrowDown":
					event.srcElement.value = dragonblocks.chat.historyDown();
					break;
			}
		});
		input.addEventListener("input", _ => { dragonblocks.chat.input[dragonblocks.chat.input.length - 1] = event.srcElement.value });
		document.body.appendChild(input);
	}	
	open(){
		dragonblocks.keyHandler.lockAll();
		document.getElementById("dragonblocks.chat").style.visibility = "visible";
		document.getElementById("dragonblocks.chat.input").style.visibility = "visible";
		document.getElementById("dragonblocks.chat.input").focus();
	}
	close(){
		setTimeout(_ => {dragonblocks.keyHandler.unlockAll();});
		document.getElementById("dragonblocks.chat").style.visibility = "hidden";
		document.getElementById("dragonblocks.chat.input").style.visibility = "hidden";
		document.getElementById("dragonblocks.chat.input").blur();
	}
	write(text){
		text = text || "";
		if(text.startsWith("!HTML"))
			text = text.replace("!HTML", "");
		else
			text = dblib.htmlEntities(text);
		text += "<br>";
		document.getElementById("dragonblocks.chat").innerHTML += text;
		document.getElementById("dragonblocks.chat").lastChild.scrollIntoView();
	}
	send(input){
		for(let func of dragonblocks.onChatMessageFunctions)
			if(func(input) == false)
				return false;
		this.write(input);
	}
	historyUp(){
		this.history--;
		if(this.input[this.input.length + this.history] == undefined)
			this.history++;
		return this.input[this.input.length + this.history];
	}
	historyDown(){
		this.history++;
		if(this.input[this.input.length + this.history] == undefined)
			this.history--;
		return this.input[this.input.length + this.history];
	}
	clear(){
		document.getElementById("dragonblocks.chat").innerHTML = "<br>".repeat(this.lines);
	}
};
dragonblocks.chat = new dragonblocks.Chat();
dragonblocks.chatMessage = function(msg){
	dragonblocks.chat.write(msg);
}
dragonblocks.onChatMessageFunctions = [];
dragonblocks.registerOnChatMessage = function(func){
	dragonblocks.onChatMessageFunctions.push(func);
}
