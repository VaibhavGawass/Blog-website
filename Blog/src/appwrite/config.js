import conf from '../conf/conf';
import {Client,ID, TablesDB, Storage,Query} from 'appwrite';

export class Service {
  client = new Client();
  tablesDB;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.tablesDB = new TablesDB(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.tablesDB.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId: slug,
        data: {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      });
    } catch (error) {
      console.log("Appwrite Serive :: createPost :: error", error);
    }
  }

  async updatePost(slug,{title,content,featuredImage,status}) {
    try {
      return await this.tablesDB.updateRow({
        databaseId:conf.appwriteDatabaseId,
        tableId:conf.appwriteTableId,
        rowId:slug,
        data:{
            title,
            content,
            featuredImage,
            status
        }
      });
    } catch (error) {
        console.log("Appwrite service :: updatePost :: error",error);
    }
  }

  async deletePost(slug){
    try {
        await this.tablesDB.deleteRow({
            databaseId:conf.appwriteDatabaseId,
            tableId:conf.appwriteTableId,
            rowId:slug
        });
        return true;
    } catch (error) {
        console.log("Appwrite service :: deletePost :: error", error);
        return false;
    }
  }

  async getPost(slug){
    try {
        return await this.tablesDB.getRow({
            databaseId:conf.appwriteDatabaseId,
            tableId:conf.appwriteTableId,
            rowId:slug
        });
    } catch (error) {
        console.log("Appwrite service :: getPost :: error", error);
    }
  }

  async getPosts(){
    try {
        return await this.tablesDB.listRows({
            databaseId:conf.appwriteDatabaseId,
            tableId:conf.appwriteTableId,
            queries:[
                Query.equal("status","active")
            ]
        })
    } catch (error) {
        console.log("Appwrite service :: getPosts :: error", error);
        return false;
    }
  }

  //file Upload Service

  async uploadFile(file){
    try {
        return await this.storage.createFile({
            bucketId:conf.appwriteBucketId,
            fileId:ID.unique(),
            file
        })
    } catch (error) {
        console.log("Appwrite service :: uploadFile :: error", error);
        return false;
    }
  }

  async deleteFile(fileId){
    try {
        await this.storage.deleteFile({
            bucketId:conf.appwriteBucketId,
            fileId
        });
        return true;
    } catch (error) {
        console.log("Appwrite service :: deleteFile :: error", error);
        return false;
    }
  }

  getFilePreview(fileId){
    return this.storage.getFilePreview({
        bucketId:conf.appwriteBucketId,
        fileId
    });
  }
}
    

const service = new Service();

export default service;