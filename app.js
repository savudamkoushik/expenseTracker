var budgetController=(function(){
    var Expense=function(id,desc,value){
        this.id=id,
        this.desc=desc,
        this.value=value
    };
    var Income=function(id,desc,value){
        this.id=id,
        this.desc=desc,
        this.value=value
    };
    var data={
        allItem:{
            exp:[],
            inc:[]
        },
        total:{
            exp:0,
            inc:0
        }
    }
    return{
        addItem:function(type,desc,val){
            var newItemm,id=0;
            if(data.allItem[type].length-1>=0)
            id=data.allItem[type][data.allItem[type].length-1].id+1;
            if(type==='inc'){
                newItem=new Income(id,desc,val);
            }
            else{
                newItem=new Expense(id,desc,val);
            }
            data.allItem[type].push(newItem);
            return newItem;
        },
        testing:function(){
            console.log(data);
        }
    }

})();

var UIController=(function(){
    var DomString={
        inputType:'.add__type',
        inputDesc:'.add__description',
        inputVal:'.add__value',
        inputBtn:'.add__btn'
    }

    return {
        getInput:function(){
            return {
                type:document.querySelector(DomString.inputType).value,
                desc:document.querySelector(DomString.inputDesc).value,
                number:document.querySelector(DomString.inputVal).value  
            }
        },
        getDomString:function(){
            return DomString;
        }
        
    };

})();


var Controller=(function(budgetCtrl,UiCtrl){


    var setUpEventListeners=function(){
        var Dom=UiCtrl.getDomString();
        document.querySelector(Dom.inputBtn).addEventListener('click',addItem);
        document.addEventListener('keypress',function(event){
           if(event.which===13||event.keyCode===13){
                addItem();
           }
        });
    }
    
    var addItem=function(){
        //1.get the input data 
        var input=UiCtrl.getInput();
        console.log(input);
        //2.add the item to budget controller

    var newItem=budgetCtrl.addItem(input.type,input.desc,input.number);
    // console.log(newItem.testing());

        //3.add the item to ui

        //4.calculate the budget

        //5.display the budget ont the ui
    }
    return{
        init:function(){
            setUpEventListeners();
        }
    }
    
})(budgetController,UIController);

Controller.init();