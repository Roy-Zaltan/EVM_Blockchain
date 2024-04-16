export default function defaultProfile(name){
    let seed = name.split(' ').join('%20')
    return `https://api.dicebear.com/5.x/initials/svg?seed=${seed}`
}