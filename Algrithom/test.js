
//Tim cac so nguyen to nho hon bang x
var getSnt = function(x) {
  var a = [];
  for(var i = 0;i<=x;i++){
    a[i] = true;
  }
  a[0] = false;
  a[1] = false;
   // Vì i * i luôn không là Snt nên lọc các giá trị i * i và nhỏ hơn x
  for(var i = 2;i * i <= x;i++){
    if(a[i]){
      for(var j = i * i;j<=x;j+=i){
        if(a[j]) a[j] = false;
      }
    }
  }
  
  var Snt = [];
  for(var i = 2;i<=x;i++){
    if(a[i] === true) Snt.push(a[i]);
  }
  return Snt;
}

var FindSnt = function(a){
  //Tim gia tri lon nhat
  var max = -1;
  for(var i = 0;i<10;i++){
    for(var j = 0;j<10;j++){
      if(a[i][j] > max){
        max = a[i][j];
      }
    }
  }
  //Tim cac so nguyen to nho hon hoac bang max
  var Snt = getSnt(max);

  var Nt = [];
  for(var i = 0;i<10;i++){
    for(var j = 0;j<10;j++){
      if(Snt.include(a[i][j])){
        Nt.push(a[i][j])
      }
    }
  }

  return Nt;
}

var Fin

//Độ phức tạp O(nlogn)
//Trường hợp nhanh nhất O(nlogn)
//Trường hợp xấu nhất O(n2) nếu daỹ đã sắp xếp
var quickSort = function(a){

  var pivot = a.length - 1;
  var left = [];
  var right = [];
  
  //Chia phần tử giá trị nhỏ hơn pivot vào Left còn lại vào Right
  for(var i = 0;i<a.length;i++){
    if(a[i] < pivot) left.push(a[i])
      else right.push(a[i])
  }
  
  //Đệ quy với Left và Right đồng thời ghép bằng toán tử '...'
  return [...quickSort(left),pivot,...quickSort(right)]

}

//Tinh tong
var Tong = function(a){
  var Total = 0;
  for(var i =0;i<a.length;i++){
    Total += a[i];
  }
}

//Check 1 && 99
var check = function(a){
  var check1 = false;
  var check2 = false;
  for(var i = 0;i<a.length;i++){
    if(a[i] === 1) check1 = true;
    if(a[i] === 99) check2 = true;
  }
  if(check1 && check2) return true;
  return false;
}

//Tim tong lon nhat
var FirstCheck = function(a){
  var max = -1000000;
  var k = 0;
  for(var i = 0;i<a.length;i++){
    if(Tong(a[i]) > max) {max = a[i];k = i}
  }
  return a[k];
}
//Tim cac mang bao gom 1 && 99
var SecondCheck = function(a){
  var array = [];
  for(var i = 0;i<a.length;i++){
    if(check(a[i])) array.push(a[i]);
  }
  return array;
}



Bang Student {StudentId(PrKey),sex,age,majorId(FrKey to Major.MajorId)}
Bang Major   {MajorId(PrKey),name}
Bang Subject {SubjectId(PrKey),name,Tc,majorId(FrKey to Major.MajorId)}
Bang Score   {StudentId,MajorId,date,score} //StudentId,MajorId,date là Khóa chính

- Điểm thi lưu ở bảng Score phân biệt bằng giá trị 'Score.date'
- cho sinh viên mã uni123 tìm các môn bạn theo học ta có truy vấn:

   select Su.name as SubjectName, Su.SubjectId
   from   Subject Su join Score Student St
   where  St.majorId = Su.majorId
   group by Su.studentId
   having Su.studentId = uni123


 - cho sinh viên mã uni123 tìm các điểm trung bình các môn học ta có truy vấn:
   //Giả sử điểm trung bình là điểm giữa các lần thi của 1 môn học
    with getSubject as (select Su.name as SubjectName, Su.SubjectId as SubjectId, St.StudentId as StudentId
      from   Subject Su join Score Student St
      where  St.majorId = Su.majorId
      group by Su.studentId
      having Su.studentId = uni123)

   
   select gs.SubujectId, name, Round(Avg(Sum(sc.score)/count(gs.MajorId)),2) 
   from getSubject gs join Score sc
   where gs.StudentId = sc.StudentId and gs.SubjectId = sc.SubjectId
