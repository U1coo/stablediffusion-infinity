// import { w2ui,w2toolbar,w2field,query,w2alert, w2utils,w2confirm} from "https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js"
// import { w2ui,w2toolbar,w2field,query,w2alert, w2utils,w2confirm} from "https://cdn.jsdelivr.net/gh/vitmalina/w2ui@master/dist/w2ui.es6.min.js"

// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
    add_image(reader.result);
    //  console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log("Error: ", error);
   };
}

function getText(file) {
   var reader = new FileReader();
   reader.readAsText(file);
   reader.onload = function () {
    window.postMessage(["load",reader.result],"*")
    //  console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log("Error: ", error);
   };
}

document.querySelector("#upload_file").addEventListener("change", (event)=>{
    console.log(event);
    let file = document.querySelector("#upload_file").files[0];
    getBase64(file);
})

document.querySelector("#upload_state").addEventListener("change", (event)=>{
    console.log(event);
    let file = document.querySelector("#upload_state").files[0];
    getText(file);
})

var button_lst=["clear", "load", "save", "export", "upload", "selection", "canvas", "eraser", "outpaint", "accept", "cancel", "retry", "prev", "current", "next", "eraser_size_btn", "eraser_size", "resize_selection", "scale", "zoom_in", "zoom_out", "help"];
var upload_button_lst=['clear', 'load', 'save', "upload", 'export', 'outpaint', 'resize_selection', 'help'];
var resize_button_lst=['clear', 'load', 'save', "upload", 'export', "selection", "canvas", "eraser", 'outpaint', 'resize_selection',"zoom_in", "zoom_out", 'help'];
var outpaint_button_lst=['clear', 'load', 'save', "canvas", "eraser", "upload", 'export', 'resize_selection', "zoom_in", "zoom_out",'help'];
var outpaint_result_lst=["accept", "cancel", "retry", "prev", "current", "next"];
var outpaint_result_func_lst=["accept", "retry", "prev", "current", "next"];

function check_button(id,text="",checked=true,tooltip="")
{
    return { type: "check",  id: id, text: text, icon: checked?"fa-solid fa-square-check":"fa-regular fa-square", checked: checked, tooltip: tooltip };
}

var toolbar=new w2toolbar({
    box: "#toolbar",
    name: "toolbar",
    tooltip: "top",
    items: [
        { type: "button", id: "clear", text: "Reset", icon: "fa-solid fa-rectangle-xmark" },
        { type: "break" },
        { type: "button", id: "load", tooltip: "Load Canvas", icon: "fa-solid fa-file-import" },
        { type: "button", id: "save", tooltip: "Save Canvas", icon: "fa-solid fa-file-export" },
        { type: "button", id: "export", tooltip: "Export Image", icon: "fa-solid fa-floppy-disk" },
        { type: "break" },
        { type: "button", id: "upload", text: "Upload Image", icon: "fa-solid fa-upload" },
        { type: "break" },
        { type: "radio", id: "selection", group: "1", tooltip: "Selection", icon: "fa-solid fa-arrows-up-down-left-right", checked: true },
        { type: "radio", id: "canvas", group: "1", tooltip: "Canvas", icon: "fa-solid fa-image" },
        { type: "radio", id: "eraser", group: "1", tooltip: "Eraser", icon: "fa-solid fa-eraser" },
        { type: "break" },
        { type: "button", id: "outpaint", text: "Outpaint", icon: "fa-solid fa-brush" },
        { type: "break" },
        { type: "button", id: "accept", text: "Accept", icon: "fa-solid fa-check", hidden: true, disable:true,},
        { type: "button", id: "cancel", text: "Cancel", icon: "fa-solid fa-ban", hidden: true},
        { type: "button", id: "retry", text: "Retry", icon: "fa-solid fa-rotate", hidden: true, disable:true,},
        { type: "button", id: "prev", tooltip: "Prev Result", icon: "fa-solid fa-caret-left", hidden: true, disable:true,},
        { type: "html", id: "current", hidden: true, disable:true,
            async onRefresh(event) {
                await event.complete
                let fragment = query.html(`
                <div class="w2ui-tb-text">
                <div class="w2ui-tb-count">
                    <span>${this.sel_value ?? "1/1"}</span>
                </div> </div>`)
                query(this.box).find("#tb_toolbar_item_current").append(fragment)
            }
        },
        { type: "button", id: "next", tooltip: "Next Result", icon: "fa-solid fa-caret-right", hidden: true,disable:true,},
        { type: "button", id: "add_image", text: "Add Image", icon: "fa-solid fa-file-circle-plus", hidden: true,disable:true,},
        { type: "button", id: "delete_image", text: "Delete Image", icon: "fa-solid fa-trash-can", hidden: true,disable:true,},
        { type: "button", id: "confirm", text: "Confirm", icon: "fa-solid fa-check", hidden: true,disable:true,},
        { type: "button", id: "cancel_overlay", text: "Cancel", icon: "fa-solid fa-ban", hidden: true,disable:true,},
        { type: "break" },
        { type: "spacer" },
        { type: "break" },
        { type: "button", id: "eraser_size_btn", tooltip: "Eraser Size", text:"Size", icon: "fa-solid fa-eraser", hidden: true, count: 32},
        { type: "html", id: "eraser_size", hidden: true,
            async onRefresh(event) {
                await event.complete
                // let fragment = query.html(`
                //     <input type="number" size="${this.eraser_size ? this.eraser_size.length:"2"}" style="margin: 0px 3px; padding: 4px;" min="8" max="${this.eraser_max ?? "256"}" value="${this.eraser_size ?? "32"}">
                //     <input type="range" style="margin: 0px 3px; padding: 4px;" min="8" max="${this.eraser_max ?? "256"}" value="${this.eraser_size ?? "32"}">`)
                let fragment = query.html(`
                    <input type="range" style="margin: 0px 3px; padding: 4px;" min="8" max="${this.eraser_max ?? "256"}" value="${this.eraser_size ?? "32"}">
                    `)
                fragment.filter("input").on("change", event => {
                    this.eraser_size = event.target.value;
                    window.overlay.freeDrawingBrush.width=this.eraser_size;
                    this.setCount("eraser_size_btn", event.target.value);
                    window.postMessage(["eraser_size", event.target.value],"*")
                    this.refresh();
                })
                query(this.box).find("#tb_toolbar_item_eraser_size").append(fragment)
            }
        },
        // { type: "button", id: "resize_eraser", tooltip: "Resize Eraser", icon: "fa-solid fa-sliders" },
        { type: "button", id: "resize_selection", tooltip: "Resize Selection", icon: "fa-solid fa-expand" },
        { type: "break" },
        { type: "html", id: "scale",
            async onRefresh(event) {
                await event.complete
                let fragment = query.html(`
                <div class="">
                <div style="padding: 4px; border: 1px solid silver">
                    <span>${this.scale_value ?? "100%"}</span>
                </div></div>`)
                query(this.box).find("#tb_toolbar_item_scale").append(fragment)
            }
        },
        { type: "button", id: "zoom_in", tooltip: "Zoom In", icon: "fa-solid fa-magnifying-glass-plus" },
        { type: "button", id: "zoom_out", tooltip: "Zoom Out", icon: "fa-solid fa-magnifying-glass-minus" },
        { type: "break" },
        { type: "button", id: "help", tooltip: "Help", icon: "fa-solid fa-circle-info" },
        { type: "new-line"},
        { type: "button", id: "setting", tooltip: "Settings", icon: "fa-solid fa-sliders" },
        { type: "break" },
        check_button("enable_img2img","Enable Img2Img",false),
        // check_button("use_correction","Photometric Correction",false),
        check_button("resize_check","Resize Small Input",true),
        check_button("enable_safety","Enable Safety Checker",true),
        {type: "break"},
        check_button("use_seed","Use Seed:",false),
        { type: "html", id: "seed_val",
            async onRefresh(event) {
                await event.complete
                let fragment = query.html(`
                    <input type="number" style="margin: 0px 3px; padding: 4px; width:100px;" value="${this.config_obj.seed_val ?? "0"}">`)
                fragment.filter("input").on("change", event => {
                    this.config_obj.seed_val = event.target.value;
                    parent.config_obj=this.config_obj;
                    this.refresh();
                })
                query(this.box).find("#tb_toolbar_item_seed_val").append(fragment)
            }
        },
        { type: "button", id: "random_seed", tooltip: "Set a random seed", icon: "fa-solid fa-dice" },
    ],
    onClick(event) {
        switch(event.target){
            case "upload":
                this.upload_mode=true
                document.querySelector("#overlay_container").style.pointerEvents="auto";
                this.click("canvas");
                this.click("selection");
                this.show("confirm","cancel_overlay","add_image","delete_image");
                this.enable("confirm","cancel_overlay","add_image","delete_image");
                this.disable(...upload_button_lst);
                query("#upload_file").click();
                break;
            case "resize_selection":
                this.resize_mode=true;
                this.disable(...resize_button_lst);
                this.enable("confirm","cancel_overlay");
                this.show("confirm","cancel_overlay");
                window.postMessage(["resize_selection",""],"*");
                document.querySelector("#overlay_container").style.pointerEvents="auto";
                break;
            case "confirm":
                if(this.upload_mode)
                {
                    export_image();
                }
                else
                {
                    let sel_box=this.selection_box;
                    window.postMessage(["resize_selection",sel_box.x,sel_box.y,sel_box.width,sel_box.height],"*");
                }
            case "cancel_overlay":
                end_overlay();
                this.hide("confirm","cancel_overlay","add_image","delete_image");
                if(this.upload_mode){
                    this.enable(...upload_button_lst);
                }
                else
                {
                    this.enable(...resize_button_lst);
                    window.postMessage(["resize_selection","",""],"*");
                }
                this.disable("confirm","cancel_overlay","add_image","delete_image");
                this.upload_mode=false;
                this.resize_mode=false;
                this.click("selection");
                break;
            case "add_image":
                query("#upload_file").click();
                break;
            case "delete_image":
                let active_obj = window.overlay.getActiveObject();
                if(active_obj)
                {
                    window.overlay.remove(active_obj);
                    window.overlay.renderAll();
                }
                else
                {
                    w2utils.notify("You need to select an image first",{error:true,timeout:2000,where:query("#container")})
                }
                break;
            case "load":
                query("#upload_state").click()
                break;
            case "next":
            case "prev":
                window.postMessage(["outpaint", "", event.target], "*");
                break;
            case "outpaint":
                this.disable(...outpaint_button_lst);
                this.show(...outpaint_result_lst);
                if(this.outpaint_tip)
                {
                    this.outpaint_tip=false;
                    w2utils.notify("The canvas stays locked until you accept/cancel current outpainting",{timeout:10000,where:query("#container")})
                }
                document.querySelector("#container").style.pointerEvents="none";
            case "retry":
                this.disable(...outpaint_result_func_lst);
                window.postMessage(["transfer",""],"*")
                break;
            case "accept":
            case "cancel":
                this.hide(...outpaint_result_lst);
                this.disable(...outpaint_result_func_lst);
                this.enable(...outpaint_button_lst);
                document.querySelector("#container").style.pointerEvents="auto";
                window.postMessage(["click", event.target],"*");
                break;
            case "eraser":
            case "selection":
            case "canvas":
                if(event.target=="eraser")
                {
                    this.show("eraser_size","eraser_size_btn");
                    window.overlay.freeDrawingBrush.width=this.eraser_size;
                    window.overlay.isDrawingMode = true;
                }
                else
                {
                    this.hide("eraser_size","eraser_size_btn");
                    window.overlay.isDrawingMode = false;
                }
                if(this.upload_mode)
                {
                    if(event.target=="canvas")
                    {
                        window.postMessage(["mode", event.target],"*")
                        document.querySelector("#overlay_container").style.pointerEvents="none";
                        document.querySelector("#overlay_container").style.opacity = 0.5;
                    }
                    else
                    {
                        document.querySelector("#overlay_container").style.pointerEvents="auto";
                        document.querySelector("#overlay_container").style.opacity = 1.0;
                    }
                }
                else
                {
                    window.postMessage(["mode", event.target],"*")
                }
                break;
            case "help":
                w2alert("stablediffusion-infinity: https://github.com/lkwq007/stablediffusion-infinity");
                break;
            case "clear":
                w2confirm("Reset canvas?").yes(() => {
                    window.postMessage(["click", event.target],"*");
                }).no(() => {})
                break;
            case "random_seed":
                this.config_obj.seed_val=Math.floor(Math.random() * 3000000000);
                parent.config_obj=this.config_obj;
                this.refresh();
                break;
            case "enable_img2img":
            case "use_correction":
            case "resize_check":
            case "enable_safety":
            case "use_seed":
                let target=this.get(event.target);
                target.icon=target.checked?"fa-regular fa-square":"fa-solid fa-square-check";
                this.config_obj[event.target]=!target.checked;
                parent.config_obj=this.config_obj;
                this.refresh();
                break;
            default:
                // clear, save, export, outpaint, retry
                // break, save, export, accept, retry, outpaint
                window.postMessage(["click", event.target],"*")
        }
        console.log("Target: "+ event.target, event)
    }
})
window.w2ui=w2ui;
w2ui.toolbar.config_obj={
    resize_check: true,
    enable_safety: true,
    use_correction: false,
    enable_img2img: false,
    use_seed: false,
    seed_val: 0,
};
w2ui.toolbar.outpaint_tip=true;
window.update_count=function(cur,total){
  w2ui.toolbar.sel_value=`${cur}/${total}`;
  w2ui.toolbar.refresh();
}
window.update_eraser=function(val,max_val){
  w2ui.toolbar.eraser_size=`${val}`;
  w2ui.toolbar.eraser_max=`${max_val}`;
  w2ui.toolbar.setCount("eraser_size_btn", `${val}`);
  w2ui.toolbar.refresh();
}
window.update_scale=function(val){
  w2ui.toolbar.scale_value=`${val}`;
  w2ui.toolbar.refresh();
}
window.enable_result_lst=function(){
  w2ui.toolbar.enable(...outpaint_result_lst);
}
function onObjectScaled(e)
{
    let object = e.target;
    if(object.isType("rect"))
    {
        let width=object.getScaledWidth();
        let height=object.getScaledHeight();
        object.scale(1);
        width=Math.max(Math.min(width,window.overlay.width-object.left),256);
        height=Math.max(Math.min(height,window.overlay.height-object.top),256);
        let l=Math.max(Math.min(object.left,window.overlay.width-width-object.strokeWidth),0);
        let t=Math.max(Math.min(object.top,window.overlay.height-height-object.strokeWidth),0);
        object.set({ width: width, height: height, left:l,top:t})
        window.w2ui.toolbar.selection_box={width: width, height: height, x:object.left, y:object.top};
    }
}
function onObjectMoved(e)
{
    let object = e.target;
    if(object.isType("rect"))
    {   
        let l=Math.max(Math.min(object.left,window.overlay.width-object.width-object.strokeWidth),0);
        let t=Math.max(Math.min(object.top,window.overlay.height-object.height-object.strokeWidth),0);
        object.set({left:l,top:t});
        window.w2ui.toolbar.selection_box={width: object.width, height: object.height, x:object.left, y:object.top};
    }
}
window.setup_overlay=function(width,height)
{
    if(window.overlay)
    {
        window.overlay.setDimensions({width:width,height:height});
        let app=parent.document.querySelector("gradio-app");
        app=app.shadowRoot??app;
        app.querySelector("#sdinfframe").style.height=80+Number(height)+"px";
        document.querySelector("#container").style.height= height+"px";
        document.querySelector("#container").style.width = width+"px";
    }
    else
    {
        canvas=new fabric.Canvas("overlay_canvas");
        canvas.setDimensions({width:width,height:height});
        let app=parent.document.querySelector("gradio-app");
        app=app.shadowRoot??app;
        app.querySelector("#sdinfframe").style.height=80+Number(height)+"px";
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.on("object:scaling", onObjectScaled);
        canvas.on("object:moving", onObjectMoved);
        window.overlay=canvas;
    }
    document.querySelector("#overlay_container").style.pointerEvents="none";
}
window.update_overlay=function(width,height)
{
    window.overlay.setDimensions({width:width,height:height},{backstoreOnly:true});
    // document.querySelector("#overlay_container").style.pointerEvents="none";
}
window.adjust_selection=function(x,y,width,height)
{
    var rect = new fabric.Rect({
        left: x,
        top: y,
        fill: "rgba(0,0,0,0)",
        strokeWidth: 3, 
        stroke: "rgba(0,0,0,0.7)",
        cornerColor: "red",
        cornerStrokeColor: "red",
        borderColor: "rgba(255, 0, 0, 1.0)",
        width: width,
        height: height,
        lockRotation: true,
    });
    rect.setControlsVisibility({ mtr: false });
    window.overlay.add(rect);
    window.overlay.setActiveObject(window.overlay.item(0));
}
function add_image(url)
{
    fabric.Image.fromURL(url,function(img){
        window.overlay.add(img);
        window.overlay.setActiveObject(img);
    },{left:100,top:100});
}
function export_image()
{
    data=window.overlay.toDataURL();
    document.querySelector("#upload_content").value=data;
    window.postMessage(["upload",""],"*");
    end_overlay();
}
function end_overlay()
{
    window.overlay.clear();
    document.querySelector("#overlay_container").style.opacity = 1.0;
    document.querySelector("#overlay_container").style.pointerEvents="none";
}
document.querySelector("#container").addEventListener("wheel",(e)=>{e.preventDefault()})
window.setup_shortcut=function(json)
{
    var config=JSON.parse(json);
    var key_map={};
    Object.keys(config.shortcut).forEach(k=>{
        key_map[config.shortcut[k]]=k;
    })
    document.addEventListener("keydown",(e)=>{
        if(e.target.tagName!="INPUT")
        {
            let key=e.key;
            if(e.ctrlKey)
            {
                key="Ctrl+"+e.key;
                if(key in key_map)
                {
                    e.preventDefault();
                }
            }
            if(key in key_map)
            {
                w2ui.toolbar.click(key_map[key]);
            }
        }
    })
}