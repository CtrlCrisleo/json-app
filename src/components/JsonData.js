import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_warning } from '../functions';

const JsonData = () => {
    const url='https://jsonplaceholder.typicode.com/posts';
    const [JSONdata, setJSONData] = useState([]);
    const [userId, setUserId] = useState('');
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(()=>{
        getJSONData();
    },[]);

    const getJSONData = async () => {
        const answer =await axios.get(url);
        setJSONData(answer.data);
        console.log(answer.data);
    }

    const openModal = (option, id, userId, title, body) =>{
        setId('');
        setUserId('');
        setTitle('');
        setBody('');
        setOperation('option');
        if(option === 1){
            setModalTitle('Publish new post');
        }
        else if(option === 2){
            setModalTitle('Update post')
            setId(id);
            setUserId(userId);
            setTitle(title);
            setBody(body);
        }
        window.setTimeout(function(){
            document.getElementById('userId').focus();
        },500);
    }

    const review = () =>{
        var parameter;
        var method;
        if(userId === ''){
            show_warning('Type the user ID please','warning');
        }
        else if(title.trim() === ''){
            show_warning('Type the title please','warning');
        }
        else if(body.trim() === ''){
            show_warning('Type the body please','warning');
        }
        else{
            if(operation === 1){
                parameter = {userId:userId, title:title.trim(), body:body.trim()};
                method = 'POST';
            }
            else{
                parameter = {id:id, userId:userId, title:title.trim(), body:body.trim()};
                method = 'PUT';
            }
            sendRequest(parameter, method);
        }
    }

    const sendRequest = async(parameter, method) => {
        await axios({method:method, url:url, data:parameter}).then(function(ans){
            var type = ans.data[0];
            var msg = ans.data[1];
            show_warning(msg,type);
            if(type === 'success'){
                document.getElementById('btnClose').click();
                getJSONData();
            }
        })
        .catch(function(error){
            show_warning('Request failed','error');
            console.log(error);
        })
    }

    const deletePost = (id) =>{
        const mySwal = withReactContent(Swal);
        mySwal.fire({
            title:'Are you sure to delete this post?',
            icon:'question',
            text: 'It is irreversible',
            showCancelButton:true,
            confirmButtonText:'Yes',
            cancelButtonText:'No'
        }).then((result) => {
            if(result.isConfirmed){
                setId(id);
                sendRequest('DELETE', {id:id});
            }
            else{
                show_warning('The post was not deleted', 'info');
            }
        })
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalJSONData'>
                            <i class="fa-solid fa-file-circle-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr><th>ID</th><th>USER ID</th><th>TITLE</th><th>BODY</th></tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {JSONdata.map((JSONdata)=>(
                                <tr key={JSONdata.id}>
                                    <td>{JSONdata.id}</td> 
                                    <td>{JSONdata.userId}</td>
                                    <td>{JSONdata.title}</td>
                                    <td>{JSONdata.body}</td>
                                    <td>
                                        <button onClick={() => openModal(2, JSONdata.id, JSONdata.userId, JSONdata.title, JSONdata.body)} 
                                            className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalJSONData'>
                                                <i className='fa-solid fa-file-pen'></i>
                                        </button>
                                        &nbsp; 
                                        <button onClick={() => deletePost(JSONdata.id)} className='btn btn-danger'>
                                            <i className='fa-solid fa-dumpster-fire'></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id='modalJSONData' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{modalTitle}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                            <input type='text' id='userID' className='form-control' placeholder='User Id' 
                            value={userId} onChange={(e)=> setUserId(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-globe'></i></span>
                            <input type='text' id='title' className='form-control' placeholder='Title' 
                            value={title} onChange={(e)=> setTitle(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-bookmark'></i></span>
                            <input type='text' id='body' className='form-control' placeholder='Body' 
                            value={body} onChange={(e)=> setBody(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => review()} className='button button-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Save
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnClose' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default JsonData