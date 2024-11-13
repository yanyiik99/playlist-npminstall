import React, { useEffect, useState } from 'react';
import { Col, Row, Card, List, Typography, Badge, Input, Layout, FloatButton, Modal, Button, Form, Select, Image, notification} from 'antd';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Logo from '../../assets/Npm-logo.svg';
import { getDataUTS, sendDataUTS } from '../../utils/apiuts';

const { Meta } = Card;
const { Text, Link } = Typography;
const { Header, Content, Footer } = Layout;

const dataDummy = [
  {id_play: 1, play_name: "02 Test Playlist", play_genre: "music", play_url: "02 Test URL", play_description: "02 test Description", play_thumbnail: "Thumbnail", created_at: "2024-11-08T08:57:27.000000Z", updated_at: "2024-11-08T08:57:27.000000Z"},
  {id_play: 2, play_name: "02 Test Playlist", play_genre: "music", play_url: "02 Test URL", play_description: "02 test Description", play_thumbnail: "Thumbnail", created_at: "2024-11-08T08:57:27.000000Z", updated_at: "2024-11-08T08:57:27.000000Z"},
  {id_play: 3, play_name: "02 Test Playlist", play_genre: "music", play_url: "02 Test URL", play_description: "02 test Description", play_thumbnail: "Thumbnail", created_at: "2024-11-08T08:57:27.000000Z", updated_at: "2024-11-08T08:57:27.000000Z"},
  {id_play: 4, play_name: "02 Test Playlist", play_genre: "music", play_url: "02 Test URL", play_description: "02 test Description", play_thumbnail: "Thumbnail", created_at: "2024-11-08T08:57:27.000000Z", updated_at: "2024-11-08T08:57:27.000000Z"}, 
]

const dataGenre = [
  {id: 1, label: "Music", value: "music"},
  {id: 2, label: "Games", value: "games"},
  {id: 3, label: "Sport", value: "sport"},
  {id: 4, label: "News", value: "news"},
  {id: 5, label: "Film", value: "film"},
]

const Playlist = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const urlPlaylist = '/api/playlist/5';

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description
    })
  }

  // MODAL
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
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

    let url = "/api/playlist/5";
    let request = sendDataUTS(url, formData);

    request
      .then((resp) => {
        if(resp?.datas) {
          showAlert(
            "success", "Data Terkirim", "Data Berhasil Disimpan"
          );
          form.resetFields();
          getDataPlaylist();
          setIsModalOpen(false);
        } else {
          showAlert("error", "Gagal Terkirim", "Data Tidak Berhasil Dikirim");
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Gagal Terkirim", "Koneksi ke API Tidak Berhasil");
      })
  };

  return (
    <div className='layout-content bg-gray-950 px-20 min-h-screen'>      
    {contextHolder}
        <Layout className='bg-gray-950'>
          <Header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 0px'}} className='bg-gray-950'>
            <img src={Logo} alt="" className='demo-logo' style={{ maxWidth: '70px' }}/>
          </Header>
          <Content style={{ padding: '0px'}}>

            <FloatButton 
              type="primary"
              icon={<PlusCircleOutlined/>}
              tooltip={<div>Add Playlist</div>}  
              onClick={showModal}            
            />

            <Modal title="ADD PLAYLIST" open={isModalOpen} onOk={handleSubmit} onCancel={handleCancel}>
              <Form layout="vertical">
                <Form.Item label="Playlist Name" name="play_name" required style={{ marginTop: '20px' }}>
                  <Input/>
                </Form.Item>

                <Form.Item label="Playlist Genre" name="play_genre" required style={{ marginTop: '-15px' }}>
                  <Select
                    defaultValue="---"
                    style={{
                      
                    }}
                    options={dataGenre}
                  />
                </Form.Item>

                <Form.Item label="Playlist URL" name="play_url" required style={{ marginTop: '-15px' }}>
                  <Input/>
                </Form.Item>

                <Form.Item label="Playlist Thumbnail" name="play_thumbnail" required style={{ marginTop: '-15px' }}>
                  <Input/>
                </Form.Item>

                <Form.Item label="Playlist Descriptions" name="play_description" required style={{ marginTop: '-15px' }}>
                  <Input.TextArea rows={4}/>
                </Form.Item>
              </Form>
            </Modal>

            <div className='bg-banner'>
              <Row gutter={[24, 0]}>
                <Col md={24} xl={12} className="mb-24">
                    <Typography.Title 
                        level={1}
                        style={{
                          marginTop: 50,
                          color: '#fff'
                        }}
                        >
                        Play, Complete, Follow Popular Streamers
                    </Typography.Title>

                    <Typography.Text 
                        type="secondary"
                        style={{
                          marginTop: 50,
                          color: '#acacac',
                          fontSize: '18px'
                        }}
                        >
                        Play, Complete, Follow Popular Streamers
                    </Typography.Text>
                    
                </Col>

                <Col md={24} xl={12} className="mb-24">
                  
                </Col>
              </Row>
            </div>

            <div className="bg-genre">
              <Row gutter={[24, 0]}>
                <Col md={24} xl={12} className="mb-24">              
                  <List
                    grid={{
                      gutter: 16,
                      xs: 5,
                    }}
                    dataSource={dataGenre}
                    renderItem={(item) => (
                      <List.Item>
                        <button className='bg-transparent text-white border py-1 px-5 rounded-3xl mt-1'>{item?.label}</button>
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
                      '--placeholder-color': '#fff'
                    }} 
                    size="large" placeholder="  Search Playlist. . ." prefix={<SearchOutlined />}         
                />
                </Col>
              </Row>
            </div>

            <div className="bg-content" style={{ marginTop: '-100px' }}>
              <List
                style={{ marginTop: "20px" }}
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 4
                }}
                dataSource={dataPlaylist}
                renderItem={(item) => (
                  <List.Item>
                    <Link href={item?.play_url} target="_blank">
                    <Card 
                      hoverable 
                      actions={[
                        <DeleteOutlined key="delete" />,
                        <EditOutlined key="edit" onClick={()=>showModal()} />,
                      ]}
                      cover={<img className='p-4 !rounded-lg' alt="img" src={item?.play_thumbnail} />}
                    >
                      <Badge count={item?.play_genre} showZero color="#faad14" />
                      <Meta title={<Typography.Title level={3} style={{marginTop: 10,}}>{item?.play_name}</Typography.Title>}
                        description={
                          <div style={{ marginTop: '-10px' }}>
                            <Text type="secondary">
                              {item?.play_description}
                            </Text>
                          </div>
                        }
                      />
                    </Card>
                    </Link>
                  </List.Item>
                )}
              />   
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}} className='bg-gray-950 text-white'>
            Playlist Websites ©{new Date().getFullYear()} Created by NPM Install
          </Footer>
        </Layout>

    </div>
  )
}

export default Playlist