import getData from '../getData'

const path = `/user`
export const typeDefault = {
  userList: 'getUserList'
}

export function getUserList(type, params) {

    let defaultParams =  { 
      }
    if(!type)
      type = typeDefault

		console.log({params});
		
    if(params)
      defaultParams = {        
        ...defaultParams,
        ...params,
      }

    return getData(path, type, defaultParams)
}