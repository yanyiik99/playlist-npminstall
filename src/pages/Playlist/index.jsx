import { useEffect, useState } from 'react';
import { Col, Row, Card, List, Typography, Badge, Input, Layout, FloatButton, Modal, Form, Select, notification, Popconfirm, Avatar} from 'antd';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import Logo from '../../assets/Npm-logo.svg';
import { deleteDataUTS, getDataUTS, sendDataUTS } from '../../utils/apiuts';
import classNames from 'classnames';
import './index.css';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text, Link } = Typography;
const { Header, Content, Footer } = Layout;

const dataGenre = [
  {id: 0, label: "All", value: "all"},
  {id: 1, label: "Music", value: "music"},
  {id: 2, label: "Song", value: "song"},
  {id: 3, label: "Movie", value: "movie"},
  {id: 4, label: "Education", value: "education"},
  {id: 5, label: "Other", value: "other"},
]

const Playlist = () => {

  // General State
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const urlPlaylist = '/api/playlist/5';
  const [activeTabs, setActiveTabs] = useState("all");
  const [seachPlaylist, setSeachPlaylist] = useState("");

  // Edit State
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);


  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description
    })
  }

  // Show Modal
  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  
  // Close Modal
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const getDataPlaylist = () => {
    getDataUTS(urlPlaylist)
    .then((ress)=>{
      if(ress?.datas){
        setIsLoading(false);
        setDataPlaylist(ress?.datas);
      }else{
        console.log(ress);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(()=>{
    getDataPlaylist();
  },[])

  const handleSubmit = () => {
    let playName = form.getFieldValue("play_name")
    let playGenre = form.getFieldValue("play_genre")
    let playUrl = form.getFieldValue("play_url")
    let playDescription = form.getFieldValue("play_description")
    let playThumbnail = form.getFieldValue("play_thumbnail")
    
    let formData = new FormData()
    formData.append("play_name", playName)
    formData.append("play_genre", playGenre)
    formData.append("play_url", playUrl)
    formData.append("play_description", playDescription)
    formData.append("play_thumbnail", playThumbnail)
    
    let url = isEdit ? `/api/playlist/update/${idSelected}` : "/api/playlist/5";
    let request = sendDataUTS(url, formData);

    request
      .then((resp) => {
        setIsModalOpen(false);
        if(resp?.datas) {
          showAlert(
            "success", "Data Terkirim", "Data Berhasil Disimpan"
          );
          form.resetFields();
          getDataPlaylist();
        } else {
          showAlert("error", "Gagal Terkirim", "Data Tidak Berhasil Dikirim");
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Gagal Terkirim", "Koneksi ke API Tidak Berhasil");
      })
  };


  const handleEditData = (item) => {
    form.resetFields();
    setIsEdit(true);
    setIsModalOpen(true);
    setIdSelected(item?.id_play);
    form.setFieldValue("play_name", item?.play_name);
    form.setFieldValue("play_genre", item?.play_genre);
    form.setFieldValue("play_url", item?.play_url);
    form.setFieldValue("play_thumbnail", item?.play_thumbnail);
    form.setFieldValue("play_description", item?.play_description);
  }

  const handleDelete = (record_id) => {
      let url = `/api/playlist/${record_id}`;
      let params = new URLSearchParams();

      params.append("id", record_id);

      deleteDataUTS(url, params).then((ress) =>{
          if(ress?.message == "OK"){
              showAlert("success", "Berhasil Dihapus", "Data Berhasil Dihapus");
              getDataPlaylist();
              form.resetFields();
              setIsModalOpen(false);
          }else{
              showAlert("error", "Gagal Dihapus", "Data Gagal Dihapus!");
          }
      }).catch((err) => {
          console.log(err);
          
          showAlert("error", "Gagal Dihapus", "Koneksi Jaringan Terputus!");
      })
  }

  const tabsFiltered = (item) => {
    setActiveTabs(item?.value);
  }

  const handleSearchPlaylist = (e) => {
    setActiveTabs("all");
      setSeachPlaylist(e.target.value.toLowerCase());
  };


  const filteredData = activeTabs === 'all'
      ? dataPlaylist.filter((item) =>
            item.play_name.toLowerCase().includes(seachPlaylist) ||
            item.play_description.toLowerCase().includes(seachPlaylist))
      : dataPlaylist.filter((item) => item.play_genre === activeTabs);

  return (
    <div className='layout-content min-h-screen'>      
    {contextHolder}
        <Layout className='bg-black'>
          <Content style={{ padding: '0px'}}>

            <FloatButton 
              type="primary"
              icon={<PlusCircleOutlined/>}
              tooltip={<div>Add Playlist</div>}  
              onClick={()=>{
                setIsEdit(false);
                showModal();
              }}            
            />

            <Modal 
              title={`${isEdit ? 'EDIT' : 'ADD'} PLAYLIST`}
              style={{ fontFamily: 'Poppins' }} 
              open={isModalOpen} 
              onOk={()=>{
                form
                .validateFields()
                .then(handleSubmit)
                .catch((err) => {
                  console.log(err);
                })
                
              }} 
              onCancel={handleCancel}
            >
              <Form 
                layout="vertical"
                requiredMark={true}
                form={form}
              >
                <Form.Item 
                  label="Playlist Name" 
                  name="play_name" 
                  style={{ marginTop: '20px', fontFamily: 'Poppins' }} 
                  rules={[
                    {required: true, message: "Playlist Name Wajib Diisi"}
                  ]}
                >
                  <Input maxLength="30" style={{ fontFamily: 'Montserrat' }}/>
                </Form.Item>

                <Form.Item 
                  label="Playlist Genre" 
                  name="play_genre" 
                  style={{ marginTop: '-15px' }}
                  rules={[
                    {required: true, message: "Genre Wajib Diisi"}
                  ]}
                >
                  <Select
                    defaultValue="---"
                    options={dataGenre.filter(item=>item.id !== 0)}
                    style={{ fontFamily: 'Montserrat' }}
                  />
                </Form.Item>

                <Form.Item 
                  label="Playlist URL" 
                  name="play_url" 
                  style={{ marginTop: '-15px' }}
                  rules={[
                    {required: true, message: "URL Wajib Diisi"}
                  ]}
                >
                  <Input style={{ fontFamily: 'Montserrat' }}/>
                </Form.Item>

                <Form.Item 
                  label="Playlist Thumbnail" 
                  name="play_thumbnail" 
                  required style={{ marginTop: '-15px' }}
                  rules={[
                    {required: true, message: "Thumbanil Wajib Diisi"}
                  ]}
                >
                  <Input style={{ fontFamily: 'Montserrat' }}/>
                </Form.Item>

                <Form.Item 
                  label="Playlist Descriptions" 
                  name="play_description" 
                  style={{ marginTop: '-15px' }}
                  rules={[
                    {required: true, message: "Deskripsi Wajib Diisi"}
                  ]}
                >
                  <Input.TextArea rows={4} maxLength="100" style={{ fontFamily: 'Montserrat' }}/>
                </Form.Item>
              </Form>
            </Modal>

            <div className='bg-banner px-7 md:px-20'>
              <Header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 0px'}} className='bg-transparent'>
                <img onClick={()=>navigate('/')} src={Logo} alt="" className='demo-logo cursor-pointer' style={{ maxWidth: '70px' }}/>
                  <Avatar
                    style={{ backgroundColor: '#1677ff' }}
                    size={{ xs: 24, sm: 24, md: 30, lg: 30, xl: 40, xxl: 50 }}
                    icon={<UserOutlined />}
                  />
              </Header>

              <Typography.Title 
                  level={1}
                  style={{
                    marginTop: 70,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Poppins',
                    // fontSize: '50px'
                  }}
                  className='md:text-6xl'
                  >
                  Playlists to Brighten Your Day
              </Typography.Title>

              <Typography.Title 
                  level={5}
                  style={{
                    width: '60%',
                    lineHeight: '1.8',
                    margin: '10px auto',
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Montserrat',
                    fontWeight: '300'
                  }}
                  >
                  Start your day with captivating playlists! From motivation to light-hearted fun, choose your vibe and watch anytime, anywhere.
              </Typography.Title>

            </div>

            <div className="bg-genre px-20">
              <Row gutter={[24, 0]}>
                <Col md={24} xl={12} className="mb-24">              
                  <List
                    grid={{
                      gutter: 10,
                      xs: 2,
                      md: 5
                    }}
                    dataSource={dataGenre}
                    renderItem={(item) => (
                      <List.Item>
                        <button 
                          className={classNames(
                                  (activeTabs == item?.value ? 'bg-blue-600 border-blue-600' : 'bg-transparent' ), 
                                  'text-white border py-1 px-5 rounded-3xl mt-1')} 
                          onClick={()=>tabsFiltered(item)}
                          style={{ fontFamily: 'Montserrat',  }}    
                        >
                          {item?.label}
                        </button>
                      </List.Item>
                    )}
                  /> 
                </Col>

                <Col md={24} xl={12} className="mb-24">
                  <Input 
                    className='custom-input'
                    style={{ 
                      marginBottom: "20px", 
                      backgroundColor: 'transparent', 
                      borderRadius: '100px', 
                      color: '#fff',
                      fontFamily: 'Montserrat'
                    }} 
                    size="large" 
                    placeholder="  Search Playlist. . ." 
                    prefix={<SearchOutlined style={{  marginRight: '5px' }}/>}         
                    onChange={handleSearchPlaylist}
                />
                </Col>
              </Row>
            </div>

            <div className="bg-content px-20" style={{ marginTop: '-100px' }}>
              <List
                style={{ marginTop: "20px" }}
                grid={{
                  gutter: 2,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 3,
                }}
                dataSource={filteredData}
                renderItem={(item) => (
                  <List.Item>
                      <Card 
                        className='bg-transparent border-none hover:scale-105 hover:transition-all hover:duration-150'
                        actions={[
                          <Popconfirm
                              key={item?.id_play}
                              title="Delete the task"
                              description={`Are you sure to delete ${item?.play_name}`}
                              okText="Hapus"
                              cancelText="Tidak"
                              onConfirm={()=>handleDelete(item?.id_play)}>
                              <Text>Delete</Text><DeleteOutlined style={{ color: '#fff' }}/>
                          </Popconfirm>,
                          <EditOutlined key="edit" onClick={()=>handleEditData(item)} style={{ color: '#fff' }}/>,                          
                        ]}
                        cover={<img className='p-4' alt="img" src={item?.play_thumbnail} style={{ borderRadius: '20px' }}/>}
                      >
                        <Badge 
                          count={item?.play_genre} 
                          showZero 
                          color="#1677ff" 
                          style={{ fontSize: '10px', fontFamily: 'Montserrat', textTransform: 'uppercase', marginTop: '-20px', borderColor: '#1677ff' }} 
                        />

                        <Meta 
                          title={
                            <Link href={item?.play_url} target='_blank'>
                              <Typography.Title level={4} style={{marginTop: 10, color: '#fff', fontFamily: 'Poppins'}} >
                                {item?.play_name}
                              </Typography.Title>
                            </Link>
                          }
                          description={
                            <div style={{ marginTop: '-10px' }}>
                              <Text className='text-gray-500' style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>
                                {item?.play_description}
                              </Text>
                            </div>
                          }
                        />
                      </Card>
                  </List.Item>
                )}
              />   
            </div>
          </Content>
          <Footer style={{textAlign: 'center', fontFamily: 'Montserrat', marginTop: '50px'}} className='bg-black text-white'>
            Playlist Websites © {new Date().getFullYear()} Created by NPM Install
          </Footer>
        </Layout>

    </div>
  )
}

export default Playlist