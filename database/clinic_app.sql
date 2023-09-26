-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2023 at 03:16 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_diagnosis`
--

CREATE TABLE `tb_diagnosis` (
  `id` varchar(32) NOT NULL,
  `id_patient` varchar(32) NOT NULL,
  `id_doctor` varchar(32) NOT NULL,
  `id_pharmacist` varchar(32) NOT NULL,
  `detail_diagnosis` varchar(255) NOT NULL,
  `complaint` varchar(255) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'Periksa',
  `rest_time` int(5) NOT NULL,
  `created_by` varchar(32) NOT NULL,
  `created_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_diagnosis`
--

INSERT INTO `tb_diagnosis` (`id`, `id_patient`, `id_doctor`, `id_pharmacist`, `detail_diagnosis`, `complaint`, `status`, `rest_time`, `created_by`, `created_time`) VALUES
('7982766d7e0c45b8ab6829fd908a3b01', 'd2a4e61b4b964ad483274193a295d1a0', 'e552b7bbc6a74fc38935bd90df0450ed', '', 'Panuan', 'Terdapat panu di selangkangan', 'Periksa', 5, 'SYSTEM', '2022-12-21 22:28:54'),
('9593145a8c0840878aaf47277207aad3', 'd2a4e61b4b964ad483274193a295d1a0', 'e552b7bbc6a74fc38935bd90df0450ed', '', 'Panuan', '', 'Periksa', 5, 'SYSTEM', '2022-12-21 22:28:54'),
('b82e1367ffd54c1aa5ba4d9997260fae', 'd2a4e61b4b964ad483274193a295d1a0', 'e552b7bbc6a74fc38935bd90df0450ed', '', 'Panuan', '', 'Periksa', 5, 'SYSTEM', '2022-12-21 22:28:54'),
('e70b703d398a4a47a90dc46baa4016bc', 'd2a4e61b4b964ad483274193a295d1a0', '676859ea7e7e4248be4dde2179f9376e', '', 'sakit perut', 'Sering Merasa sakit dibagian perut', 'Periksa', 2, '676859ea7e7e4248be4dde2179f9376e', '2022-12-31 07:45:10');

-- --------------------------------------------------------

--
-- Table structure for table `tb_medicine`
--

CREATE TABLE `tb_medicine` (
  `id` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `category` varchar(32) NOT NULL,
  `price` double(30,2) NOT NULL,
  `stock` int(5) NOT NULL,
  `created_by` varchar(32) NOT NULL,
  `created_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_medicine`
--

INSERT INTO `tb_medicine` (`id`, `name`, `category`, `price`, `stock`, `created_by`, `created_time`) VALUES
('36a7de4c018d46089363e74f659e6cca', 'Paracetamol', 'medicine', 2000.00, 100, 'System', '2022-12-15 14:43:12'),
('6a3029d749e642dc9c77fcbd02d8e1f0', 'Obat batuk', 'medicine', 2000.00, 100, '676859ea7e7e4248be4dde2179f9376e', '2022-12-18 19:49:15');

-- --------------------------------------------------------

--
-- Table structure for table `tb_patient`
--

CREATE TABLE `tb_patient` (
  `id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `dob` date NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) NOT NULL DEFAULT 'Laki-laki',
  `created_by` varchar(64) NOT NULL,
  `created_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_patient`
--

INSERT INTO `tb_patient` (`id`, `name`, `dob`, `address`, `phone`, `gender`, `created_by`, `created_time`) VALUES
('466f83beb49d4488babd69ea8836da06', 'patient 2', '2009-09-01', 'Jalan braga nomor 69', '08001290887', 'Laki-laki', 'System', '2022-12-14 22:46:00'),
('d2a4e61b4b964ad483274193a295d1a0', 'patient', '2009-09-01', 'Jalan braga', '080012908123', 'Laki-laki', '676859ea7e7e4248be4dde2179f9376e', '2022-12-18 17:39:04');

-- --------------------------------------------------------

--
-- Table structure for table `tb_prescription`
--

CREATE TABLE `tb_prescription` (
  `id_medicine` varchar(32) NOT NULL,
  `id_diagnosis` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_prescription`
--

INSERT INTO `tb_prescription` (`id_medicine`, `id_diagnosis`) VALUES
('36a7de4c018d46089363e74f659e6cca', 'b82e1367ffd54c1aa5ba4d9997260fae'),
('36a7de4c018d46089363e74f659e6cca', 'e70b703d398a4a47a90dc46baa4016bc');

-- --------------------------------------------------------

--
-- Table structure for table `tb_queue`
--

CREATE TABLE `tb_queue` (
  `id` varchar(32) NOT NULL,
  `id_patient` varchar(32) NOT NULL,
  `queue_number` int(5) NOT NULL,
  `register_date` date NOT NULL,
  `created_by` varchar(32) NOT NULL,
  `created_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_queue`
--

INSERT INTO `tb_queue` (`id`, `id_patient`, `queue_number`, `register_date`, `created_by`, `created_time`) VALUES
('781a93acb4bc4ce0b14c17458636fefd', '466f83beb49d4488babd69ea8836da06', 2, '2022-12-31', '676859ea7e7e4248be4dde2179f9376e', '2022-12-31 06:45:25'),
('861cc39c41414fd08fc7638cddbb906b', 'd2a4e61b4b964ad483274193a295d1a0', 1, '2022-08-01', '676859ea7e7e4248be4dde2179f9376e', '2022-12-18 17:59:31'),
('87553dbe56ab40d1b506f672be7218f1', 'd2a4e61b4b964ad483274193a295d1a0', 5, '2022-12-25', '676859ea7e7e4248be4dde2179f9376e', '2022-12-25 10:38:05'),
('92225cbc773c4f70a599dabd81bdda39', 'd2a4e61b4b964ad483274193a295d1a0', 1, '2022-08-01', '676859ea7e7e4248be4dde2179f9376e', '2022-12-18 17:59:54'),
('961e76ac9eb14f9495980e1d84419b20', 'd2a4e61b4b964ad483274193a295d1a0', 2, '2022-12-25', '676859ea7e7e4248be4dde2179f9376e', '2022-12-25 09:46:21'),
('b354a52bec3647ffa43e8fbf6b9ea88f', 'd2a4e61b4b964ad483274193a295d1a0', 1, '2022-12-31', '676859ea7e7e4248be4dde2179f9376e', '2022-12-31 06:29:50'),
('bee2bcc9133a4da9841f7cf8e27a29e1', '466f83beb49d4488babd69ea8836da06', 1, '2022-12-25', '676859ea7e7e4248be4dde2179f9376e', '2022-12-25 09:41:15'),
('d51ddf27e0a9454e8a20ac3ff3a52135', 'd2a4e61b4b964ad483274193a295d1a0', 4, '2022-12-25', '676859ea7e7e4248be4dde2179f9376e', '2022-12-25 09:48:55'),
('dce36a1437d04e569f40445348c7e32e', 'd2a4e61b4b964ad483274193a295d1a0', 3, '2022-12-31', '676859ea7e7e4248be4dde2179f9376e', '2022-12-31 10:19:32');

-- --------------------------------------------------------

--
-- Table structure for table `tb_role`
--

CREATE TABLE `tb_role` (
  `id` int(11) NOT NULL,
  `description` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_role`
--

INSERT INTO `tb_role` (`id`, `description`) VALUES
(1, 'admin'),
(2, 'apoteker'),
(3, 'dokter');

-- --------------------------------------------------------

--
-- Table structure for table `tb_token`
--

CREATE TABLE `tb_token` (
  `id` varchar(32) NOT NULL,
  `id_user` varchar(32) NOT NULL,
  `token` text NOT NULL,
  `ip_address` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_token`
--

INSERT INTO `tb_token` (`id`, `id_user`, `token`, `ip_address`) VALUES
('158244feed6f4ae197c798395c6f3522', '78898c8a8a48422b8f612178ec763799', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNzg4OThjOGE4YTQ4NDIyYjhmNjEyMTc4ZWM3NjM3OTkiLCJ1c2VybmFtZSI6ImFkbWluMiIsInBhc3N3b3JkIjoiVTJGc2RHVmtYMStIaW8yTFJiQTlUWXF1UG10WlBVTitUWWFhMjhHSzlMaz0iLCJuaXAiOiIxMjM0NTY3OSIsImZ1bGxuYW1lIjoiQWRtaW4iLCJkb2IiOiIyMDAwLTAxLTAyVDAwOjAwOjAwLjAwMFoiLCJhZGRyZXNzIjoiSmFsYW4gbWVyZGVrYSIsInBob25lIjoiMDg5MTIzODA5MjEzIiwiZW1haWwiOiJhZG1pbjJAZ21haWwuY29tIiwicm9sZSI6IjEiLCJzdGF0dXMiOjEsImNyZWF0ZWRfdGltZSI6IjIwMjItMTItMDFUMDk6MDk6MDkuMDAwWiIsImNyZWF0ZWRfYnkiOiJTeXN0ZW0ifSwiaWF0IjoxNjcyNDg5OTExLCJleHAiOjE2NzI1MzMxMTF9.rO1JaXWyjRNVamcUhtSdQ3FORCv4sHJTPhn8dYk8IZg', '169.254.76.1'),
('1f107b6f893a46c481a73b03f900f566', '676859ea7e7e4248be4dde2179f9376e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjc2ODU5ZWE3ZTdlNDI0OGJlNGRkZTIxNzlmOTM3NmUiLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJVMkZzZEdWa1gxOHhaMlhHUUpmWnJOT3ZITkZWTG1PZkVhUGRzbG5QcnNnPSIsIm5pcCI6IjEyMzQ1Njc4IiwiZnVsbG5hbWUiOiJBZG1pbiIsImRvYiI6IjIwMjItMTItMDFUMDA6MDA6MDAuMDAwWiIsImFkZHJlc3MiOiJKYWxhbiBDaWt1dHJhIiwicGhvbmUiOiIwODAwMDEyMzA5ODIxIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiMSIsInN0YXR1cyI6MSwiY3JlYXRlZF90aW1lIjoiMjAyMi0xMi0xNVQwOTo0MToyNi4wMDBaIiwiY3JlYXRlZF9ieSI6IlN5c3RlbSJ9LCJpYXQiOjE2NzI0Nzk3NjksImV4cCI6MTY3MjUyMjk2OX0.M4b7vgAnyeRwkExjP46pvOkrUWPo8fqXuokfXqHQBNQ', '169.254.76.1'),
('33d009c7a42147b28052f1f72106a66c', '66241f99ebd04945b771db0d5db49617', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjYyNDFmOTllYmQwNDk0NWI3NzFkYjBkNWRiNDk2MTciLCJ1c2VybmFtZSI6ImFwb3Rla2VyMSIsInBhc3N3b3JkIjoiVTJGc2RHVmtYMThXY0FRSWtiTW9sREVUYzl5NFBOQ3h0WjNDemN4YmhJND0iLCJuaXAiOiIxMjM0NTY3NSIsImZ1bGxuYW1lIjoiRG9rdGVyIiwiZG9iIjoiMTk5Ny0wNS0wMlQwMDowMDowMC4wMDBaIiwiYWRkcmVzcyI6IkphbGFuIG1lcmRla2EiLCJwaG9uZSI6IjA4OTEyMzgwOTIxMyIsImVtYWlsIjoiYXBvdGVrZXJAZ21haWwuY29tIiwicm9sZSI6IjIiLCJzdGF0dXMiOjEsImNyZWF0ZWRfdGltZSI6IjIwMjItMTItMjFUMTU6MTc6MDAuMDAwWiIsImNyZWF0ZWRfYnkiOiI3ODg5OGM4YThhNDg0MjJiOGY2MTIxNzhlYzc2Mzc5OSJ9LCJpYXQiOjE2NzI0OTA2NzgsImV4cCI6MTY3MjUzMzg3OH0.e2Vb1Z3ANq6fz5LjJ82H_HecwfJhglor5h5h05Kvvhs', '169.254.76.1'),
('80af1f7698844bd6af0e77b26d20501f', 'e552b7bbc6a74fc38935bd90df0450ed', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiZTU1MmI3YmJjNmE3NGZjMzg5MzViZDkwZGYwNDUwZWQiLCJ1c2VybmFtZSI6ImRva3RlciIsInBhc3N3b3JkIjoiVTJGc2RHVmtYMS9kTnEydDV5MjVTdERaQTQzUm4wZnl6bXdqYUVhOWpYYz0iLCJuaXAiOiIxMjM0NTY3ODk5IiwiZnVsbG5hbWUiOiJOYW1hIGRva3RlciIsImRvYiI6IjIwMDAtMDEtMDJUMDA6MDA6MDAuMDAwWiIsImFkZHJlc3MiOiJKYWxhbiBtZXJkZWthIiwicGhvbmUiOiIwODkxMjM4MDkyMTMiLCJlbWFpbCI6ImRva3RlckBnbWFpbC5jb20iLCJyb2xlIjoiMyIsInN0YXR1cyI6MSwiY3JlYXRlZF90aW1lIjoiMjAyMi0xMi0zMFQyMTo0NToyNi4wMDBaIiwiY3JlYXRlZF9ieSI6Ijc4ODk4YzhhOGE0ODQyMmI4ZjYxMjE3OGVjNzYzNzk5In0sImlhdCI6MTY3MjQ3NzU4NiwiZXhwIjoxNjcyNTIwNzg2fQ.XjFifpDRvhnk3NC9RfBDVeq16JC4-IoCwRZAKp5GNNI', '169.254.76.1');

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id` varchar(32) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `nip` varchar(32) NOT NULL,
  `fullname` varchar(32) NOT NULL,
  `dob` date NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(64) NOT NULL,
  `role` varchar(32) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0,
  `created_time` datetime NOT NULL,
  `created_by` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id`, `username`, `password`, `nip`, `fullname`, `dob`, `address`, `phone`, `email`, `role`, `status`, `created_time`, `created_by`) VALUES
('66241f99ebd04945b771db0d5db49617', 'apoteker1', 'U2FsdGVkX18WcAQIkbMolDETc9y4PNCxtZ3CzcxbhI4=', '12345675', 'Dokter', '1997-05-02', 'Jalan merdeka', '089123809213', 'apoteker@gmail.com', '2', 1, '2022-12-21 15:17:00', '78898c8a8a48422b8f612178ec763799'),
('676859ea7e7e4248be4dde2179f9376e', 'admin', 'U2FsdGVkX18xZ2XGQJfZrNOvHNFVLmOfEaPdslnPrsg=', '12345678', 'Admin', '2022-12-01', 'Jalan Cikutra', '0800012309821', 'admin@gmail.com', '1', 1, '2022-12-15 09:41:26', 'System'),
('78898c8a8a48422b8f612178ec763799', 'admin2', 'U2FsdGVkX1+Hio2LRbA9TYquPmtZPUN+TYaa28GK9Lk=', '12345679', 'Admin', '2000-01-02', 'Jalan merdeka', '089123809213', 'admin2@gmail.com', '1', 1, '2022-12-01 09:09:09', 'System'),
('b9eee6ec4cd24453b0ced698bbe19a82', 'admin3', 'U2FsdGVkX1/jGhoUfsmiqhEqwzNv9Ng60UiU1830V+U=', '12345677', 'Admin', '2000-01-02', 'Jalan merdeka', '089123809213', 'admin2@gmail.com', '1', 1, '2022-12-17 21:20:43', '676859ea7e7e4248be4dde2179f9376e'),
('e552b7bbc6a74fc38935bd90df0450ed', 'dokter', 'U2FsdGVkX1/dNq2t5y25StDZA43Rn0fyzmwjaEa9jXc=', '1234567899', 'Nama dokter', '2000-01-02', 'Jalan merdeka', '089123809213', 'dokter@gmail.com', '3', 1, '2022-12-30 21:45:26', '78898c8a8a48422b8f612178ec763799');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_medicine`
--
ALTER TABLE `tb_medicine`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_patient`
--
ALTER TABLE `tb_patient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_prescription`
--
ALTER TABLE `tb_prescription`
  ADD PRIMARY KEY (`id_diagnosis`,`id_medicine`) USING BTREE;

--
-- Indexes for table `tb_queue`
--
ALTER TABLE `tb_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_role`
--
ALTER TABLE `tb_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `description` (`description`);

--
-- Indexes for table `tb_token`
--
ALTER TABLE `tb_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_user` (`id_user`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_role`
--
ALTER TABLE `tb_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
