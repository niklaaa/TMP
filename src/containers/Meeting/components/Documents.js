import React, { Component } from "react";

import { List, Icon, Button, Avatar, Upload, Row, Col, Alert } from "antd";


const Item = { List };
const Meta = { Item };

class Document extends Component {
  state = {
    fileList: [],
    errorMassageVissible: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.document !== this.props.document) {
      if (
        this.props.document.updateStatus === "FAIL" ||
        this.props.document.removeStatus === "FAIL"
      ) {
        this.setState({ errorMassageVissible: true });
        setTimeout(() => {
          this.setState({ errorMassageVissible: false });
        }, 3500);
      }

      if (this.props.document.updateStatus === "OK") {
        this.setState({ fileList: [] });
      }
    }
  }

  saveFiles = () => {
    let fd = new FormData();
    this.state.fileList.forEach(item => {
      fd.append("files", item);
    });
    this.props.updateDocuments(fd);
  };

  removeDocument = id => {
    this.props.removeDocument(id);
  };
  beforeUpload = file => {
    this.setState(state => ({
      fileList: [...state.fileList, file]
    }));
    return false;
  };

  removeFile = file => {
    let fileList = this.state.fileList.concat();
    const index = fileList.indexOf(file);
    fileList.splice(index, 1);
    this.setState({ fileList, fileList });
  };

  render() {
    const alert = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
        type="error"
      />
    );


    return (
      <Row>
        <Col span={12}>
          {this.props.document.removeStatus === "FAIL" &&
          this.state.errorMassageVissible
            ? alert
            : null}
          <List
            style={{ maxWidth: "400px" }}
            itemLayout="horizontal"
            dataSource={this.props.documents}
            renderItem={item => (
              <List.Item
                extra={
                  <Button
                    onClick={id => this.removeDocument(item.id)}
                    loading={this.props.document.removeLoading === item.id}
                    icon="delete"
                  />
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar size="small">
                      <Icon type="file-pdf" />
                    </Avatar>
                  }
                  description={
                    <a href={"http://35.246.207.122:8000" + item.path} target="_blank">
                      {item.name}
                    </a>
                  }
                />
              </List.Item>
            )}
          ></List>
        </Col>
        {this.props.meetingStatus !== 3 ? (
          <Col style={{ position: "relative", display: "block" }} span={12}>
            {this.state.errorMassageVissible &&
            this.props.document.updateStatus === "FAIL"
              ? alert
              : null}
            <Upload
              beforeUpload={this.beforeUpload}
              onRemove={this.removeFile}
              multiple={true}
              showUploadList={true}
              fileList={this.state.fileList}
            >
              <Button style={{marginLeft: "10px"}}>
                <Icon type="upload" /> SELECT FILES
              </Button>
            </Upload>
            <Button
              style={{ position: "absolute", right: "0", top: "0" }}
              onClick={this.saveFiles}
              type="primary"
              disabled={!this.state.fileList.length}
              loading={this.props.document.updateLoading}
              onClick={this.saveFiles}
            >
              SPREMI
            </Button>
          </Col>
        ) : null}
      </Row>
    );
  }
}

export default Document;
