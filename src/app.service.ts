import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';


@Injectable()
export class AppService {
  
  constructor () {
    this.fetchStargazersDaily();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getStargazers(repo : string): Promise<object[]>{
    const config = {
      headers : {
        'Accept' : 'application/vnd.github.v3+json',
        'Authorization': 'token d0dc37ab6201f33a90dbe0522f91482e9a198c3b'
      }
    }
    const stargazers = await axios.get(`https://api.github.com/repos/${repo}/stargazers`,config);
    return stargazers.data;
  }

  async addNewRepo(url : string){
    var obj = {
      repos: []
    };
    var json = JSON.stringify(obj);
    await fs.readFile(path.join(__dirname, 'database.json'), 'utf8', (err, data)=>{
      if (err){
        console.log("No database found.. Creating a new one");
      } else {
        //load database
        obj = JSON.parse(data);
      }
      obj.repos.push({url : `https://api.github.com/repos/${url}`, stargazers:0});
      json = JSON.stringify(obj);
      this.insertDB(json);
    });
    return {
      status : "Ok",
    }; 
  }

  private insertDB (data : any ) {
    fs.writeFile(path.join(__dirname, 'database.json'), data, 'utf8', (err)=>{
      if(err) {
        console.log("Error writing file");
      }
    });
  }

  /* Executed every 24 hours*/
  @Cron('* * * * * 1')
  fetchStargazersDaily () {
    var obj = {
      repos: []
    };
    var json = JSON.stringify(obj);
    fs.readFile(path.join(__dirname, 'database.json'), 'utf8', async (err, data)=>{
      if (err){
        return;
      }
      obj = JSON.parse(data);

      const loop =new Promise<void>((resolve, reject) => {
        obj.repos.forEach(async(repo, index, array) => {
          await fetch(repo.url)
            .then(res => res.json())
            .then(async json => {
              repo.stargazers = json.stargazers_count;              
            });
          if (index === array.length -1) resolve();
        });  
      });

      loop.then(res =>{
        console.log("Update stargazers every day");
        json = JSON.stringify(obj);
        this.insertDB(json);
      })
    });
  }
}
