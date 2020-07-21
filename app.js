var budgetController=(function(){
    var Expense=function(id,desc,value){
        this.id=id,
        this.desc=desc,
        this.value=value,
        this.per=-1
    };
    Expense.prototype.calculatePercentage=function(totalInc){
        if(totalInc>0)
            this.per=Math.round((this.value/totalInc)*100);
        else this.per=-1;
    };
    Expense.prototype.getPercentage=function(){
        console.log(this.id+' '+this.desc+' '+this.value+' '+this.per);
        return this.per;
    }
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
        },
        budget:0,
        percentage:-1
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItem[type].forEach((ele)=>{
            sum+=ele.value;
        });
        data.total[type]=sum;
    }
    return{
        addItem:function(type,desc,val){
            var newItem,id=0;
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
        deleteItem:function(type,id){
            var ids,index;
            ids=data.allItem[type].map(function(ele){
                return ele.id;
            });
            index=ids.indexOf(Number(id));
            if(index!==-1){
                data.allItem[type].splice(index,1);
            }
            // console.log(data.allItem[type]);

        },
        testing:function(){
            console.log(data);
        },
        calculateBudget:function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget=data.total.inc-data.total.exp;
            if(data.total.inc>0){
                data.percentage=Math.round(parseFloat(data.total.exp/data.total.inc)*100);
            }
            else{
                data.percentage=-1;
            }

            // console.log(data.total.inc);
            // console.log(data.total.exp);
            // console.log(data.budget);
        },
        getBudget:function(){
            return{
                budget:data.budget,
                inc:data.total.inc,
                exp:data.total.exp,
                per:data.percentage
            }
        },
        calculatePercentages:function(){
            data.allItem.exp.forEach((el)=>{
                el.calculatePercentage(data.total.inc);
            });
        },
        getPercentage:function(){
            var allPercentages=data.allItem.exp.map((el)=>{
                return el.getPercentage();
            });
            return allPercentages;
        }
    };

})();

var UIController=(function(){
    var DomString={
        inputType:'.add__type',
        inputDesc:'.add__description',
        inputVal:'.add__value',
        inputBtn:'.add__btn',
        incomeContainr:'.income__list',
        expenseContainr:'.expenses__list',
        budgetIncomeValue:'.budget__income--value',
        budgetValue:'.budget__value',
        budgetExpValeu:'.budget__expenses--value',
        budgetPer:'.budget__expenses--percentage',
        container:'.container',
        expensesPerce:'.item__percentage',
        dateLabel:'.budget__title--month'

    };
    var formatNumber=function(type,num){
        var numSplit,int,dec,sign;

        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit=num.split('.');
        int=numSplit[0];
        if(int.length>3){
            int =int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        dec=numSplit[1];

        sign=(type=='inc')?'+':'-';
        return sign+' '+int+'.'+dec;

    }

    return {
        getInput:function(){
            return {
                type:document.querySelector(DomString.inputType).value,
                desc:document.querySelector(DomString.inputDesc).value,
                number:parseFloat(document.querySelector(DomString.inputVal).value)
            }
        },
        addListItem:function(obj,type){
            var html,newHtml,element;
            if(type=='inc'){
                element=DomString.incomeContainr;
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element=DomString.expenseContainr;
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description"> %description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.desc);
            newHtml=newHtml.replace('%value%',formatNumber(type,obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(selectroId){
            var el=document.getElementById(selectroId);
            // console.log(el);
            el.parentNode.removeChild(el);
        },
        clearFields:function(){
            var fields;
            fields=document.querySelectorAll(DomString.inputDesc+', '+DomString.inputVal);
            console.log(typeof(fields));
            fields.forEach((el)=>{
                console.log(el);
                el.value="";
            });
            fields[0].focus();
        },
        getDomString:function(){
            return DomString;
        },
        addBudget:function(budget){
            var type;
            type=(budget.budget>0)?'inc':'exp';
            document.querySelector(DomString.budgetValue).textContent=formatNumber(type,budget.budget);
            document.querySelector(DomString.budgetIncomeValue).textContent=formatNumber(type,budget.inc);
            document.querySelector(DomString.budgetExpValeu).textContent=formatNumber(type,budget.inc);
            if(budget.per>0){
                document.querySelector(DomString.budgetPer).textContent=budget.per+'%';
            }else{
                document.querySelector(DomString.budgetPer).textContent='--';
            }
        },
        displayPercentages:function(percentages){
            var fields=document.querySelectorAll(DomString.expensesPerce);
            fields.forEach((el,index)=>{
                console.log(el);
                if(percentages[index]>0)
                    el.textContent=percentages[index]+'%';
                else{
                    el.textContent='---';
                }
            });
        },
        displayMonth:function(){
            var now,year,month,months;
            now=new Date();
            year=now.getFullYear();
            month=now.getMonth();
            months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            document.querySelector(DomString.dateLabel).textContent=months[month]+' '+year;

        },
        changeType:function(){
            var fiels=document.querySelectorAll(
                DomString.inputType+','+
                DomString.inputDesc+','+
                DomString.inputVal
            );
            fiels.forEach((el)=>{
                el.classList.toggle('red-focus');
                // console.log(el.classList);
            });
            document.querySelector(DomString.inputBtn).classList.toggle('red');
        }

        
    };

})();


var Controller=(function(budgetCtrl,UiCtrl){

    var ctrlDeleteItem=function(event){
        var itemid,splitid,type,Id,actualType;
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemid);
        if(itemid){
            splitid=itemid.split('-');
            type=splitid[0];
            Id=splitid[1];
            // console.log(type);
            // console.log(id);
            actualType=type=='income'?'inc':'exp';


            //delete the item from data structure
            budgetCtrl.deleteItem(actualType,Id);

            //delete the item from ui

            UiCtrl.deleteListItem(itemid);

            updateBudget();
            updatePercentages();
            //update budget and show in  the ui
        }
    }
    var setUpEventListeners=function(){
        var Dom=UiCtrl.getDomString();
        document.querySelector(Dom.inputBtn).addEventListener('click',addItem);
        document.addEventListener('keypress',function(event){
           if(event.which===13||event.keyCode===13){
                addItem();
           }
        });

        document.querySelector(Dom.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(Dom.inputType).addEventListener('change',changeType);
    };

    var changeType=function(){
        UiCtrl.changeType();
    }

    var updateBudget=function(){
        var budgetDetails;
        //1.calculate budget
        budgetCtrl.calculateBudget();
        budgetDetails=budgetCtrl.getBudget();
        console.log(budgetDetails);

        UiCtrl.addBudget(budgetDetails);

    };


    var updatePercentages=function(){
        //1.calculate percentages.

        console.log("entered");

        budgetCtrl.calculatePercentages();


        //2.REad percentages from the budgetController.
        var perc=budgetCtrl.getPercentage();

        console.log(perc);

        UiCtrl.displayPercentages(perc);

        //3. update the ui with the new Percentages.
    }
    
    var addItem=function(){
        //1.get the input data 
        var input=UiCtrl.getInput();
        console.log(input);
        //2.add the item to budget controller
    if(input.desc!="" && !isNaN(input.number) && input.number>0){
        var newItem=budgetCtrl.addItem(input.type,input.desc,input.number);
        // console.log(newItem.testing());
        UiCtrl.addListItem(newItem,input.type);
        UiCtrl.clearFields();
            //3.add the item to ui
        updateBudget();
        updatePercentages();
    };
    

  

       
    }
    return{
        init:function(){
            UiCtrl.displayMonth();
            UiCtrl.addBudget({
                budget:0,
                inc:0,
                exp:0,
                per:0
            });
            setUpEventListeners();
        }
    }
    
})(budgetController,UIController);

Controller.init();