var config = {
    apiKey: "AIzaSyCoRXZJEffOERvO85-vcM-AGdpO-f7Y88g",
  				authDomain: "tatilliaordering.firebaseapp.com",
  				databaseURL: "https://tatilliaordering.firebaseio.com",
  				projectId: "tatilliaordering",
  				storageBucket: "tatilliaordering.appspot.com",
  				messagingSenderId: "430832741787",
  				appId: "1:430832741787:web:b79e74f89af49ac4"
};

firebase.initializeApp(config);
var database = firebase.database();

function placeOrder()
{
				var orderCounter = 0;
				var menuList;
				var oc = firebase.database().ref('Counters/OrderCounter');
				var menu = firebase.database().ref('MenuList');
				oc.once('value', function(snapshot){
					orderCounter = snapshot.val();
				});
				menu.once('value', function(snapshot){
					menuList = snapshot.val();
				});
				orderCounter++;
				var selectedItem = document.getElementById("itemSelection").value;
				var selectedQty = document.getElementById("itemQuantity").value;
				var name = document.getElementById("name").value;
				var phoneNumber = document.getElementById("phonenumber").value;
				
				firebase.database().ref('Orders/' + orderCounter).set({
					"Name": name,
					"PhoneNumber": phoneNumber,
					"Items": {"1" : { "MenuId": selectedItem, "Qty": selectedQty}}
				}); 
				firebase.database().ref('Counters/OrderCounter').set(orderCounter);
				alert("Order Placed.");
};

function UpdateTable(menuList, OrderList)
			{
				//console.log(OrderList);
				var orderTableBody = document.getElementById('tablebody');
				while (orderTableBody.firstChild){ orderTableBody.removeChild(orderTableBody.firstChild);}

				for (i = 1; i < OrderList.length; i++)
				{
					var node = getOrderData(OrderList[i], i, menuList);
					orderTableBody.appendChild(node);	
				}
			};

			function getOrderData(orderData, id, menuList)
			{
				var trNode = document.createElement("tr");
				var tdNode = document.createElement("td");
				tdNode.appendChild(document.createTextNode(id));
				trNode.appendChild(tdNode);

				tdNode = document.createElement("td");
				tdNode.appendChild(document.createTextNode(orderData["Name"]))
				trNode.appendChild(tdNode);
				tdNode = document.createElement("td");
				tdNode.appendChild(document.createTextNode(orderData["PhoneNumber"]))
				trNode.appendChild(tdNode);
				tdNode = document.createElement("td");
				var itemsOrdered = orderData["Items"];
				ulNode = document.createElement("ul");
				
				for (j = 1; j < itemsOrdered.length;j++)
				{
					liNode = document.createElement("li");
					var description = menuList[itemsOrdered[j]["MenuId"]]["Description"];
					var text = itemsOrdered[j]["Qty"] + " x " + description;
					liNode.appendChild(document.createTextNode(text));
					ulNode.appendChild(liNode);
				}
				tdNode.appendChild(ulNode)
				trNode.appendChild(tdNode);
				return trNode;
			}